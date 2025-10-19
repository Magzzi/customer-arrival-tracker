import * as XLSX from 'xlsx';
import { TimeEntry } from '@/types/time-tracking';

export function importFromExcel(file: File): Promise<TimeEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: Record<string, string | number>[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert Excel data to TimeEntry format
        const entries: TimeEntry[] = jsonData.map((row) => {
          // Parse the ID (handle scientific notation from Excel)
          const id = typeof row['ID'] === 'number' 
            ? Math.round(row['ID']) 
            : parseInt(String(row['ID'])) || Date.now() + Math.random();
          
          // Parse date
          const date = String(row['Date'] || new Date().toLocaleDateString());
          
          // Parse times from Excel format (handles "5:21:18 PM" format)
          const arrivalTime = parseExcelTimeString(String(row['Arrival Time']), date);
          const startTime = row['Start Time'] && row['Start Time'] !== '--:--' 
            ? parseExcelTimeString(String(row['Start Time']), date)
            : null;
          const endTime = row['End Time'] && row['End Time'] !== '--:--'
            ? parseExcelTimeString(String(row['End Time']), date)
            : null;
          
          return {
            id,
            arrival: arrivalTime,
            start: startTime,
            end: endTime,
            date: date,
          };
        });
        
        resolve(entries);
      } catch (error) {
        console.error('Parse error:', error);
        reject(new Error('Failed to parse Excel file. Please ensure it has the correct format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsBinaryString(file);
  });
}

function parseExcelTimeString(timeStr: string, dateStr: string): number {
  // If it's already a timestamp
  if (typeof timeStr === 'number') {
    return timeStr;
  }
  
  if (!timeStr || timeStr === '--:--') {
    return Date.now();
  }
  
  try {
    // Parse date from string (e.g., "10/19/2025")
    const [month, day, year] = dateStr.split('/').map(Number);
    
    // Parse time string (e.g., "5:21:18 PM")
    const timeMatch = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)?/i);
    if (!timeMatch) {
      return Date.now();
    }
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = parseInt(timeMatch[3]);
    const meridiem = timeMatch[4]?.toUpperCase();
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Create date object
    const date = new Date(year, month - 1, day, hours, minutes, seconds, 0);
    return date.getTime();
  } catch (error) {
    console.error('Time parse error:', error);
    return Date.now();
  }
}
import * as XLSX from 'xlsx';
import { TimeEntry } from '@/types/time-tracking';
import { calculateDurations } from './time-utils';

export function exportToExcel(entries: TimeEntry[]) {
  // Create worksheet data
  const worksheetData = entries.map(entry => {
    const durations = calculateDurations(entry);
    return {
      ID: entry.id,
      Date: entry.date,
      'Arrival Time': new Date(entry.arrival).toLocaleTimeString(),
      'Start Time': entry.start ? new Date(entry.start).toLocaleTimeString() : '--:--',
      'End Time': entry.end ? new Date(entry.end).toLocaleTimeString() : '--:--',
      'Wait Time': durations.waitTime,
      'Order Time': durations.orderTime,
      'Total Time': durations.totalTime,
    };
  });

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Entries');

  // Generate Excel file
  XLSX.writeFile(workbook, `time-entries-${new Date().toISOString().split('T')[0]}.xlsx`);
}
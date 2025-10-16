export interface TimeEntry {
  id: number;
  arrival: number;
  start: number | null;
  end: number | null;
  date: string;
}

export interface TimeCalculations {
  waitTime: string;
  orderTime: string;
  totalTime: string;
}
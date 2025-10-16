export function formatTime(milliseconds: number | null): string {
  if (!milliseconds) return '--:--';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes % 60).padStart(2, '0');
  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function calculateDurations(entry: { arrival: number; start: number | null; end: number | null }): {
  waitTime: string;
  orderTime: string;
  totalTime: string;
} {
  const now = Date.now();
  
  // Wait time: time between arrival and start
  const waitTimeMs = entry.start ? entry.start - entry.arrival : now - entry.arrival;
  
  // Order time: time between start and end
  const orderTimeMs = entry.start ? 
    (entry.end ? entry.end - entry.start : now - entry.start) :
    0;
  
  // Total time: time between arrival and end
  const totalTimeMs = entry.end ? 
    entry.end - entry.arrival :
    now - entry.arrival;
  
  return {
    waitTime: formatTime(waitTimeMs),
    orderTime: formatTime(orderTimeMs),
    totalTime: formatTime(totalTimeMs)
  };
}
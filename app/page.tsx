'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClockProvider, useClock } from '@/components/providers/clock-provider';
import { TimeEntry, TimeCalculations } from '@/types/time-tracking';
import { calculateDurations } from '@/lib/time-utils';

function TimeTracker() {
  const { currentTime, timestamp } = useClock();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [calculations, setCalculations] = useState<Record<number, TimeCalculations>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save data to localStorage when entries change
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
  }, [entries]);

  // Update calculations every second
  useEffect(() => {
    const newCalculations: Record<number, TimeCalculations> = {};
    entries.forEach(entry => {
      newCalculations[entry.id] = calculateDurations(entry);
    });
    setCalculations(newCalculations);
  }, [entries, timestamp]);

  const logArrival = () => {
    const newEntry: TimeEntry = {
      id: Date.now(),
      arrival: Date.now(),
      start: null,
      end: null,
      date: new Date().toLocaleDateString(),
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const logStart = (id: number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, start: Date.now() } : entry
      )
    );
  };

  const logEnd = (id: number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, end: Date.now() } : entry
      )
    );
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const resetData = () => {
    setEntries([]);
    localStorage.removeItem('timeEntries');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Current Time: {currentTime}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button onClick={logArrival}>Log Arrival</Button>
          <Button onClick={resetData} variant="destructive">Reset Data</Button>
          <Button 
            onClick={() => {
              if (entries.length > 0) {
                import('@/lib/export-utils').then(module => {
                  module.exportToExcel(entries);
                });
              }
            }}
            variant="outline"
            disabled={entries.length === 0}
          >
            Export to Excel
          </Button>
          <Button 
            onClick={() => {
              if (entries.length > 0) {
                import('@/lib/matlab-export').then(module => {
                  module.exportToMatlab(entries);
                });
              }
            }}
            variant="secondary"
            disabled={entries.length === 0}
          >
            Export to MATLAB
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Order Time</TableHead>
                  <TableHead>Total Time</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.id}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!entry.start && (
                          <Button
                            onClick={() => logStart(entry.id)}
                            size="sm"
                          >
                            Start
                          </Button>
                        )}
                        {entry.start && !entry.end && (
                          <Button
                            onClick={() => logEnd(entry.id)}
                            size="sm"
                          >
                            End
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{calculations[entry.id]?.waitTime}</TableCell>
                    <TableCell>{calculations[entry.id]?.orderTime}</TableCell>
                    <TableCell>{calculations[entry.id]?.totalTime}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => deleteEntry(entry.id)}
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <ClockProvider>
      <TimeTracker />
    </ClockProvider>
  );
}
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ClockContextType {
  currentTime: string;
  timestamp: number;
}

const ClockContext = createContext<ClockContextType>({
  currentTime: '',
  timestamp: 0,
});

export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState<ClockContextType>({
    currentTime: new Date().toLocaleTimeString(),
    timestamp: Date.now(),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime({
        currentTime: now.toLocaleTimeString(),
        timestamp: Date.now(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ClockContext.Provider value={time}>
      {children}
    </ClockContext.Provider>
  );
}

export const useClock = () => useContext(ClockContext);
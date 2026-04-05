import { useState, useEffect } from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { de } from 'date-fns/locale';

interface CountdownTimerProps {
  kickoffUtc: string;
}

export function CountdownTimer({ kickoffUtc }: CountdownTimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const date = new Date(kickoffUtc);

  if (isPast(date)) {
    return <span className="text-xs text-gray-400">Abgelaufen</span>;
  }

  const distance = formatDistanceToNow(date, { locale: de })
    .replace(/\bMonate(?!n)/g, 'Monaten')
    .replace(/\bTage(?!n)/g, 'Tagen');

  return (
    <span className="text-xs text-blue-600 font-medium">
      in {distance}
    </span>
  );
}

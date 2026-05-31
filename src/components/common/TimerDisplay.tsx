import { formatTime } from '../../lib/timer';

interface TimerDisplayProps {
  ms: number;
  /** When true, renders in countdown style (warning colours) */
  countdown?: boolean;
  label?: string;
}

export function TimerDisplay({ ms, countdown = false, label }: TimerDisplayProps) {
  const isUrgent = countdown && ms < 10_000; // under 10 s → red
  const isWarning = countdown && ms < 30_000 && ms >= 10_000; // under 30 s → yellow

  return (
    <div className="flex flex-col items-center">
      {label && <span className="text-xs text-gray-400 mb-0.5">{label}</span>}
      <span
        className={[
          'font-mono text-2xl font-bold tabular-nums tracking-widest',
          isUrgent
            ? 'text-red-500 animate-pulse'
            : isWarning
              ? 'text-yellow-500'
              : 'text-purple-700',
        ].join(' ')}
      >
        {formatTime(ms)}
      </span>
    </div>
  );
}

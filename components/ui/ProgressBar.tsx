interface ProgressBarProps {
  percent: number;
  label?: string;
  className?: string;
}

// Fortschrittsbalken; bei 100 % grün
export function ProgressBar({ percent, label = "Fortschritt", className = "" }: ProgressBarProps) {
  const done = percent >= 100;
  return (
    <div className={className}>
      <div className="flex justify-between text-xs font-semibold text-muted">
        <span>{label}</span>
        <span className="font-mono">{percent} %</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-line"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${done ? "bg-success" : "bg-accent"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

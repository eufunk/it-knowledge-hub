import { CircleCheck } from "lucide-react";

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ percent }: { percent: number }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4 -rotate-90 text-accent" aria-hidden>
      <circle cx="10" cy="10" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={3} />
      <circle
        cx="10"
        cy="10"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
      />
    </svg>
  );
}

// F4: Fortschritts-Badge der Kurskachel; bei 100 % „Abgeschlossen“ mit Häkchen
export function ProgressBadge({ percent }: { percent: number }) {
  if (percent >= 100) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-xs font-bold text-white shadow-sm">
        <CircleCheck aria-hidden className="size-4" strokeWidth={2.5} />
        Abgeschlossen
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur">
      <ProgressRing percent={percent} />
      {`${percent}% Fortschritt`}
    </span>
  );
}

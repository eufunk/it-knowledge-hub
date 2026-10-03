import { CircleCheck } from "lucide-react";

const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ percent }: { percent: number }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={2.5} />
      <circle
        cx="12"
        cy="12"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
      />
    </svg>
  );
}

// F4: Fortschritts-Badge der Kurskachel; bei 100 % „Abgeschlossen“ mit Häkchen
export function ProgressBadge({ percent }: { percent: number }) {
  const done = percent >= 100;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pr-4 pl-2 text-[17px] font-medium text-white shadow-sm">
      {done ? (
        <CircleCheck aria-hidden className="size-6 fill-white text-primary" strokeWidth={2.5} />
      ) : (
        <ProgressRing percent={percent} />
      )}
      {done ? "Abgeschlossen" : `${percent}% Fortschritt`}
    </span>
  );
}

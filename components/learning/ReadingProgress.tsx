"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function readPercent(targetId: string): number {
  const element = document.getElementById(targetId);
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  if (scrollable <= 0) return rect.bottom <= window.innerHeight ? 100 : 0;
  return Math.round(Math.min(Math.max(-rect.top / scrollable, 0), 1) * 100);
}

// F16: Lesefortschritt eines Kapitels anhand der Scrollposition
export function ReadingProgress({ targetId, className = "" }: { targetId: string; className?: string }) {
  const percent = useSyncExternalStore(
    subscribe,
    () => readPercent(targetId),
    () => 0,
  );

  return (
    <div
      role="progressbar"
      aria-label="Lesefortschritt"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 overflow-hidden bg-line ${className}`}
    >
      <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${percent}%` }} />
    </div>
  );
}

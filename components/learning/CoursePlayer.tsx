"use client";

import { ListTree, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CourseNav, type CourseNavProps } from "./CourseNav";

interface CoursePlayerProps {
  nav: CourseNavProps;
  topBar: ReactNode;
  children: ReactNode;
}

// F15: Kursplayer – Seitenleiste (ab 1024 px ausblendbar, darunter aufklappbar) und Inhalt
export function CoursePlayer({ nav, topBar, children }: CoursePlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`grid gap-8 ${sidebarOpen ? "lg:grid-cols-[300px_minmax(0,1fr)]" : ""}`}>
      {sidebarOpen && (
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-card border border-line bg-surface p-4">
            <CourseNav {...nav} />
          </div>
        </aside>
      )}

      <div className="min-w-0">
        <details className="group mb-6 rounded-card border border-line bg-surface lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 p-4 font-semibold">
            <ListTree aria-hidden className="size-5 text-accent" />
            Kursinhalt
          </summary>
          <div className="border-t border-line p-4">
            <CourseNav {...nav} />
          </div>
        </details>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Seitenleiste ausblenden" : "Seitenleiste einblenden"}
            title={sidebarOpen ? "Seitenleiste ausblenden" : "Seitenleiste einblenden"}
            className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent lg:flex"
          >
            {sidebarOpen ? <PanelLeftClose aria-hidden className="size-5" /> : <PanelLeftOpen aria-hidden className="size-5" />}
          </button>
          <div className="min-w-0 flex-1">{topBar}</div>
        </div>

        {children}
      </div>
    </div>
  );
}

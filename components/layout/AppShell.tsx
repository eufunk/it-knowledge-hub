import type { ReactNode } from "react";
import { Header } from "@/components/navigation/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 md:py-14">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted sm:px-6">
          <span>IT Knowledge Hub</span>
          <span className="font-mono text-xs">Lernen · Üben · Anwenden</span>
        </div>
      </footer>
    </div>
  );
}

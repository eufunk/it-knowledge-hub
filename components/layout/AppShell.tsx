import type { ReactNode } from "react";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Sidebar } from "@/components/navigation/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen px-4 pt-8 pb-28 sm:px-8 md:ml-[150px] md:px-12 md:pt-12 md:pb-12 lg:px-24">
        {children}
      </main>
      <MobileNav />
    </>
  );
}

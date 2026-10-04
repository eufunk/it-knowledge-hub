"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/konto/AccountMenu";
import { NAV_ITEMS, isActive } from "./navItems";

// F1/F2: helle, fixierte Kopfleiste mit Logo und Hauptnavigation
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="relative flex size-9 items-center justify-center rounded-[10px] bg-ink font-mono text-sm font-bold text-white">
            IT
            <span aria-hidden className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-accent" />
          </span>
          <span className="hidden text-[17px] font-bold tracking-tight sm:inline">
            Knowledge <span className="text-accent">Hub</span>
          </span>
          <span className="sr-only sm:hidden">IT Knowledge Hub</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Hauptnavigation">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 sm:px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                        active ? "bg-accent-soft text-accent" : "text-muted hover:bg-canvas hover:text-ink"
                      }`}
                    >
                      <Icon aria-hidden className="hidden size-4 sm:block" strokeWidth={2} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

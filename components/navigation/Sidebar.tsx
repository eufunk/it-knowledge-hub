"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";

// F1: feste Sidebar links (ab 768 px)
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[150px] flex-col items-center bg-sidebar py-8 text-white md:flex">
      <Link
        href="/"
        className="mb-12 flex flex-col items-center rounded-lg text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-sidebar">
          IT
        </span>
        <span className="mt-2 text-xs leading-tight font-medium text-white/80">Knowledge Hub</span>
      </Link>

      <nav aria-label="Hauptnavigation" className="w-full">
        <ul className="flex flex-col gap-6">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="group mx-auto flex w-28 flex-col items-center gap-1.5 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span
                    className={`flex h-11 w-20 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-primary" : "group-hover:bg-white/10"
                    }`}
                  >
                    <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[15px] font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

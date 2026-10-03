"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";

// F2: Bottom-Navigation unter 768 px
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-sidebar text-white md:hidden"
    >
      <ul className="flex justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 rounded-lg px-3 py-1 focus-visible:outline-2 focus-visible:outline-white"
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-primary" : ""}`}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

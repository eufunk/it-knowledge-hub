"use client";

import { CircleUser, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { logoutAction } from "@/app/konto/actions";
import { ensureAccountLoaded, getAccountState, LOADING_STATE, loadAccount, subscribeAccount } from "@/lib/utils/account-store";

const itemClass =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent";

// F22: Anmeldestatus in der Kopfleiste
export function AccountMenu() {
  const account = useSyncExternalStore(subscribeAccount, getAccountState, () => LOADING_STATE);
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void ensureAccountLoaded();
  }, []);

  if (account.status === "loading") return <span aria-hidden className="block w-10 sm:w-28" />;

  if (account.status === "user") {
    const logout = async () => {
      setBusy(true);
      await logoutAction();
      await loadAccount();
      setBusy(false);
    };
    return (
      <div className="flex items-center gap-1 border-l border-line pl-2">
        <span className="hidden items-center gap-1.5 px-2 text-sm font-semibold text-ink sm:flex" title="Angemeldet">
          <CircleUser aria-hidden className="size-4 text-accent" />
          {account.username}
        </span>
        <button
          type="button"
          onClick={logout}
          disabled={busy}
          aria-label={`Abmelden (${account.username})`}
          className={`${itemClass} text-muted hover:bg-canvas hover:text-ink disabled:opacity-50`}
        >
          <LogOut aria-hidden className="size-4" />
          <span className="hidden sm:inline">Abmelden</span>
        </button>
      </div>
    );
  }

  const active = pathname.startsWith("/anmelden") || pathname.startsWith("/registrieren");
  return (
    <Link
      href={active ? "/anmelden" : `/anmelden?weiter=${encodeURIComponent(pathname)}`}
      aria-current={active ? "page" : undefined}
      aria-label="Anmelden"
      className={`${itemClass} ${active ? "bg-accent-soft text-accent" : "bg-accent text-white hover:bg-accent-strong"}`}
    >
      <LogIn aria-hidden className="size-4" />
      <span className="hidden sm:inline">Anmelden</span>
    </Link>
  );
}

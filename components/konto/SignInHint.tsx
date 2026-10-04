"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getAccountState, LOADING_STATE, subscribeAccount } from "@/lib/utils/account-store";

// F26: Hinweis für Nicht-Angemeldete – die Lerninhalte sind nur mit Konto erreichbar
export function SignInHint() {
  const account = useSyncExternalStore(subscribeAccount, getAccountState, () => LOADING_STATE);
  if (account.status !== "anonymous") return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-accent/20 bg-accent-soft p-5">
      <p className="flex items-center gap-3 font-semibold text-ink">
        <LogIn aria-hidden className="size-5 shrink-0 text-accent" />
        Zum Lernen melde Dich an oder lege ein kostenloses Konto an.
      </p>
      <div className="flex gap-2">
        <Link
          href="/anmelden"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Anmelden
        </Link>
        <Link
          href="/registrieren"
          className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Registrieren
        </Link>
      </div>
    </div>
  );
}

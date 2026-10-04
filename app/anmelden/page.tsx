import type { Metadata } from "next";
import { LoginForm } from "@/components/konto/AuthForms";
import { safeNextPath } from "@/lib/utils/redirect";

export const metadata: Metadata = {
  title: "Anmelden",
};

// F22: Anmeldeseite
export default async function AnmeldenPage({ searchParams }: PageProps<"/anmelden">) {
  const { weiter } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <p className="font-mono text-sm text-accent">Konto</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Anmelden</h1>
      <p className="mt-3 text-muted">
        Mit Konto wird Dein Lernfortschritt gespeichert und ist auf allen Geräten verfügbar. Fortschritt, den Du ohne
        Anmeldung in diesem Browser gesammelt hast, wird übernommen.
      </p>
      <div className="mt-8 rounded-[24px] border border-line bg-surface p-6 sm:p-8">
        <LoginForm next={safeNextPath(weiter)} />
      </div>
    </div>
  );
}

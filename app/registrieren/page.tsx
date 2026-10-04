import type { Metadata } from "next";
import { RegisterForm } from "@/components/konto/AuthForms";
import { safeNextPath } from "@/lib/utils/redirect";

export const metadata: Metadata = {
  title: "Registrieren",
};

// F21: Registrierungsseite
export default async function RegistrierenPage({ searchParams }: PageProps<"/registrieren">) {
  const { weiter } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <p className="font-mono text-sm text-accent">Konto</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Registrieren</h1>
      <p className="mt-3 text-muted">
        Lege ein kostenloses Konto an, damit Dein Lernfortschritt gespeichert wird. Bisheriger Fortschritt aus diesem
        Browser wird übernommen.
      </p>
      <div className="mt-8 rounded-[24px] border border-line bg-surface p-6 sm:p-8">
        <RegisterForm next={safeNextPath(weiter)} />
      </div>
    </div>
  );
}

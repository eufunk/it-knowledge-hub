import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="font-mono text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Seite nicht gefunden</h1>
      <p className="mt-3 text-lg text-muted">Diese Seite gibt es nicht oder nicht mehr.</p>
      <ButtonLink href="/lerninhalte" className="mt-8">
        Zu den Lerninhalten
      </ButtonLink>
    </div>
  );
}

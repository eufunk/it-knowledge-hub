import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold">Seite nicht gefunden</h1>
      <p className="mt-4 text-lg text-heading/80">Diese Seite gibt es nicht oder nicht mehr.</p>
      <Link
        href="/lerninhalte"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-sidebar"
      >
        Zu den Lerninhalten
      </Link>
    </div>
  );
}

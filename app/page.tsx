import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold">IT Knowledge Hub</h1>
      <p className="mt-4 text-lg leading-relaxed text-heading/80">
        Willkommen! Hier findest du strukturierte Lerneinheiten, praxisnahe Übungen und verständlich
        aufbereitete Grundlagen zu technischen und organisatorischen IT-Themen.
      </p>
      <Link
        href="/lerninhalte"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-sidebar focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Zu den Lerninhalten
      </Link>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
};

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-sm text-accent">Über uns</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Lernen, das hängen bleibt</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        Der IT Knowledge Hub ist eine Lernplattform für IT-Inhalte: strukturierte Lerneinheiten, praxisnahe Übungen
        und verständlich aufbereitete Grundlagen zu technischen und organisatorischen Themen.
      </p>
    </div>
  );
}

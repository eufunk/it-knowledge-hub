import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
};

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold">Über uns</h1>
      <p className="mt-4 text-lg leading-relaxed text-heading/80">
        Der IT Knowledge Hub ist eine Lernplattform für IT-Inhalte: strukturierte Lerneinheiten, praxisnahe
        Übungen und verständlich aufbereitete Grundlagen zu technischen und organisatorischen Themen.
      </p>
    </div>
  );
}

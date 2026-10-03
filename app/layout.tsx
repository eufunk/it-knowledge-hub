import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT Knowledge Hub",
  description:
    "Zentrale Lernplattform für IT-Inhalte mit strukturierten Lerneinheiten und praxisnahen Übungen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}

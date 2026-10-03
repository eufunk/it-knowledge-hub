import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "@/styles/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IT Knowledge Hub",
    template: "%s · IT Knowledge Hub",
  },
  description:
    "Zentrale Lernplattform für IT-Inhalte mit strukturierten Lerneinheiten und praxisnahen Übungen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const look =
    variant === "primary"
      ? "bg-accent text-white shadow-sm shadow-accent/25 hover:bg-accent-strong"
      : "border border-line bg-surface text-ink hover:border-accent/40 hover:text-accent";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent ${look} ${className}`}
    >
      {children}
    </Link>
  );
}

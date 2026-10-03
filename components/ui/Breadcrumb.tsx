import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// F11: Brotkrümelnavigation, letzter Eintrag ist die aktuelle Seite
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight aria-hidden className="size-4 text-line" strokeWidth={2.5} />}
            {item.href ? (
              <Link href={item.href} className="rounded font-medium hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

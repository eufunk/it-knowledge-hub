import { GraduationCap, House, Info, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// F1: Einträge der Hauptnavigation
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/lerninhalte", label: "Lerninhalte", icon: GraduationCap },
  { href: "/ueber-uns", label: "Über uns", icon: Info },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

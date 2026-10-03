"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/team-members", label: "Team members" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/circle-ticker", label: "Circle ticker" },
  { href: "/admin/hero-media", label: "Hero media" },
  { href: "/admin/media", label: "Media library" },
];

export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "block py-2 text-sm font-medium transition-colors",
              active
                ? "rounded-r-[var(--radius-action)] border-l-2 border-[var(--color-accent)] bg-[var(--color-misty)] pl-[10px] pr-3 text-white"
                : "rounded-[var(--radius-action)] px-3 text-[var(--color-omega-60)] hover:bg-[var(--color-misty)] hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

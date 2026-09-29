"use client";

import { useState, type ReactNode } from "react";
import { Nav } from "@/components/admin/nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <p className="text-lg font-semibold">Alpha Motion CMS</p>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <aside
          className={cn(
            "w-full shrink-0 space-y-6 md:block md:w-56",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <div className="hidden md:block">
            <p className="text-lg font-semibold">Alpha Motion CMS</p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
          <p className="text-xs text-neutral-500 md:hidden">{email}</p>
          <Nav onNavigate={() => setMobileOpen(false)} />
          <LogoutButton />
        </aside>
        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

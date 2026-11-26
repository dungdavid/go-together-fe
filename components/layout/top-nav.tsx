"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { topNavItems } from "@/components/layout/top-nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";

export function TopNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const initials = user ? initialsFor(user.displayName) : null;

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full border-b border-border bg-background/80 backdrop-blur-xl md:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
        <div className="flex shrink-0 items-center gap-3">
          <Compass className="size-[26px] text-primary" />
          <span className="font-heading text-lg tracking-tight">Nhật Ký Xê Dịch</span>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-muted p-1">
          {topNavItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center -space-x-2">
            <div className="relative flex size-8 items-center justify-center rounded-full bg-secondary ring-2 ring-background">
              <span className="text-[10px] font-bold text-entity-partner-a">NS</span>
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-primary ring-1 ring-background" />
            </div>
            <div className="relative flex size-8 items-center justify-center rounded-full bg-secondary ring-2 ring-background">
              <span className="text-[10px] font-bold text-entity-partner-b">HT</span>
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-entity-shared ring-1 ring-background" />
            </div>
          </div>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Search className="size-4" />
            <span>Tìm</span>
            <kbd className="rounded bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          <Link
            href="/add"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_20px_-4px_rgba(255,90,60,0.4)] transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="size-[18px]" />
            <span className="hidden lg:inline">Thêm chuyến đi</span>
          </Link>

          <ThemeToggle />

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            aria-label={isAuthenticated ? "Hồ sơ" : "Đăng nhập"}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
          >
            {initials ? <span className="text-[11px] font-bold">{initials}</span> : <User className="size-[18px]" />}
          </Link>
        </div>
      </div>
    </header>
  );
}

function initialsFor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

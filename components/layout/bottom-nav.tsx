"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import { useAuth } from "@/lib/auth-context";

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [left, right] = [navItems.slice(0, 2), navItems.slice(2)];

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="relative mx-auto flex h-16 max-w-md items-center justify-between px-4">
        {left.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} isAuthenticated={isAuthenticated} />
        ))}

        <Link
          href="/add"
          aria-label="Add"
          className="absolute left-1/2 -top-5 -translate-x-1/2 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-4 ring-background active:scale-95 transition-transform"
        >
          <Plus className="size-6" />
        </Link>
        <span className="w-14" aria-hidden />

        {right.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} isAuthenticated={isAuthenticated} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  item,
  pathname,
  isAuthenticated,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  isAuthenticated: boolean;
}) {
  const href = item.href === "/profile" && !isAuthenticated ? "/login" : item.href;
  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium min-w-[48px] min-h-[48px] justify-center",
        isActive ? "text-primary-strong font-semibold" : "text-muted-foreground"
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </Link>
  );
}

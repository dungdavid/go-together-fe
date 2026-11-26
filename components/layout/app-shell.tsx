import { Compass } from "lucide-react";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopNav />

      <header className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Compass className="size-5 text-primary" />
          <span className="font-heading text-base font-semibold tracking-tight">
            Nhật Ký Xê Dịch
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1">{children}</main>

      <BottomNav />
    </div>
  );
}

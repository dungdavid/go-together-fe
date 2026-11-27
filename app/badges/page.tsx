import { Award, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { badges } from "@/lib/dashboard-data";

export default function BadgesPage() {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="pb-24 md:pb-10">
      <PageHeader
        title="Huy hiệu"
        description={`Đã mở khoá ${earnedCount}/${badges.length} danh hiệu.`}
      />

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {badges.map((badge) => {
          const percent = Math.min(100, Math.round((badge.current / badge.total) * 100));
          return (
            <div
              key={badge.id}
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                    badge.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {badge.earned ? <Award className="size-6" /> : <Lock className="size-5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {badge.current}/{badge.total} ({percent}%)
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${badge.earned ? "bg-primary" : "bg-muted-foreground/40"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

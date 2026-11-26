import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex flex-row items-center gap-3 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold leading-none">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </Card>
  );
}

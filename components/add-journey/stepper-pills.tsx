import { Check, MapPin, Backpack, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { step: 1, label: "Điểm đến", icon: MapPin },
  { step: 2, label: "Trải nghiệm", icon: Backpack },
  { step: 3, label: "Kỷ niệm", icon: Sparkles },
] as const;

export function StepperPills({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map(({ step, label, icon: Icon }) => {
        const isDone = step < current;
        const isActive = step === current;
        return (
          <div
            key={step}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "bg-gradient-to-r from-primary to-entity-shared text-white shadow-[0_0_16px_-2px_rgba(255,90,60,0.45)]"
                : isDone
                  ? "bg-secondary text-foreground"
                  : "bg-secondary text-muted-foreground opacity-70",
            )}
          >
            {isDone ? (
              <Check className="size-3.5" />
            ) : isActive ? (
              <Icon className="size-3.5" />
            ) : (
              <span className="size-1 rounded-full bg-current" />
            )}
            <span>
              {step}. {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

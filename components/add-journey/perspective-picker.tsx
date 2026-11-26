import { Check, Heart, User } from "lucide-react";
import { Perspective } from "@/lib/types";
import { cn } from "@/lib/utils";

const options: { value: Perspective; label: string; description: string; icon: typeof Heart }[] = [
  { value: "shared", label: "Cùng nhau", description: "Cả hai cùng chung một hành trình khám phá", icon: Heart },
  { value: "partnerA", label: "Bạn trai", description: "Chuyến đi riêng hoặc trải nghiệm cá nhân", icon: User },
  { value: "partnerB", label: "Bạn gái", description: "Chuyến đi riêng hoặc trải nghiệm cá nhân", icon: User },
];

const colorClasses: Record<Perspective, { text: string; bg: string; solidBg: string; ring: string }> = {
  shared: {
    text: "text-entity-shared",
    bg: "bg-entity-shared/15",
    solidBg: "bg-entity-shared",
    ring: "shadow-[0_0_20px_rgba(251,113,133,0.18)]",
  },
  partnerA: {
    text: "text-entity-partner-a",
    bg: "bg-entity-partner-a/15",
    solidBg: "bg-entity-partner-a",
    ring: "shadow-[0_0_20px_rgba(56,189,248,0.18)]",
  },
  partnerB: {
    text: "text-entity-partner-b",
    bg: "bg-entity-partner-b/15",
    solidBg: "bg-entity-partner-b",
    ring: "shadow-[0_0_20px_rgba(167,139,250,0.18)]",
  },
};

export function PerspectivePicker({
  value,
  onChange,
}: {
  value: Perspective;
  onChange: (perspective: Perspective) => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-3">
      {options.map((option) => {
        const isSelected = value === option.value;
        const colors = colorClasses[option.value];
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all md:flex-col md:items-center md:justify-center md:gap-2 md:text-center",
              isSelected ? cn(colors.bg, colors.ring) : "bg-secondary hover:bg-secondary/70",
            )}
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl md:size-8 md:rounded-full",
                isSelected ? colors.bg : "bg-muted",
                isSelected ? colors.text : "text-muted-foreground",
              )}
            >
              <Icon className="size-5 md:size-5" fill={isSelected ? "currentColor" : "none"} />
            </div>
            <div className="flex flex-col md:items-center">
              <span className={cn("text-sm font-semibold md:font-medium", isSelected ? colors.text : "text-foreground")}>
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground md:hidden">{option.description}</span>
            </div>
            {isSelected && (
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full md:absolute md:top-2 md:right-2 md:size-4",
                  colors.solidBg,
                  "text-white",
                )}
              >
                <Check className="size-3.5 md:size-2.5" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

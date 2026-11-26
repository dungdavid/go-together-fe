import { Perspective } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<Perspective, { label: string; textClass: string; bgClass: string; dotClass: string }> = {
  shared: {
    label: "Cùng nhau",
    textClass: "text-entity-shared",
    bgClass: "bg-entity-shared/10",
    dotClass: "bg-entity-shared",
  },
  partnerA: {
    label: "Bạn trai",
    textClass: "text-entity-partner-a",
    bgClass: "bg-entity-partner-a/10",
    dotClass: "bg-entity-partner-a",
  },
  partnerB: {
    label: "Bạn gái",
    textClass: "text-entity-partner-b",
    bgClass: "bg-entity-partner-b/10",
    dotClass: "bg-entity-partner-b",
  },
};

export function PerspectiveChip({
  perspective,
  className,
}: {
  perspective: Perspective;
  className?: string;
}) {
  const { label, textClass, bgClass, dotClass } = config[perspective];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium",
        textClass,
        bgClass,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}

export function perspectiveConfig(perspective: Perspective) {
  return config[perspective];
}

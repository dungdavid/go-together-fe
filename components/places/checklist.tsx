"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItem } from "@/lib/types";

export function Checklist({ items }: { items: ChecklistItem[] }) {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => setLocalItems(items), [items]);

  function toggle(id: string) {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  if (localItems.length === 0) {
    return <p className="text-sm text-muted-foreground">No checklist items yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {localItems.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => toggle(item.id)}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm hover:bg-accent transition-colors min-h-[44px]"
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border",
                item.done
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/40"
              )}
            >
              {item.done && <Check className="size-3.5" />}
            </span>
            <span className={cn(item.done && "text-muted-foreground line-through")}>
              {item.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

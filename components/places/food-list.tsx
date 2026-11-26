import { Star } from "lucide-react";
import { FoodItem } from "@/lib/types";

export function FoodList({ items }: { items: FoodItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No dishes logged yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-3 py-3">
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            {item.notes && (
              <p className="mt-0.5 text-xs text-muted-foreground">{item.notes}</p>
            )}
          </div>
          {item.rating && (
            <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < item.rating!
                      ? "size-3.5 fill-primary text-primary"
                      : "size-3.5 text-muted-foreground/30"
                  }
                />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

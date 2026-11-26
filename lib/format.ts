import { format } from "date-fns";
import { Place } from "@/lib/types";

export function formatVisitedDate(isoDate?: string): string {
  if (!isoDate) return "Chưa rõ ngày";
  return format(new Date(isoDate), "MMM d, yyyy");
}

export function checklistProgress(place: Place): { done: number; total: number } {
  const total = place.checklist.length;
  const done = place.checklist.filter((item) => item.done).length;
  return { done, total };
}

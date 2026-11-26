"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import {
  ChecklistKind,
  DraftChecklistItem,
  DraftPatch,
  JourneyDraft,
  checklistKindMeta,
  checklistProgress,
  defaultSuggestions,
  makeId,
  suggestionsByProvince,
} from "@/components/add-journey/journey-draft";
import { cn } from "@/lib/utils";

const kindOrder: ChecklistKind[] = ["experience", "place", "food"];

export function StepExperiences({
  draft,
  onChange,
}: {
  draft: JourneyDraft;
  onChange: (patch: DraftPatch) => void;
}) {
  const progress = checklistProgress(draft.checklist);
  const suggestions = draft.province ? (suggestionsByProvince[draft.province] ?? defaultSuggestions) : defaultSuggestions;

  function setChecklist(updater: (prev: DraftChecklistItem[]) => DraftChecklistItem[]) {
    onChange((prev) => ({ checklist: updater(prev.checklist) }));
  }

  function addItem(label: string, kind: ChecklistKind = "experience") {
    setChecklist((prev) => [...prev, { id: makeId("item"), kind, label, done: false }]);
  }

  function updateItem(id: string, patch: Partial<DraftChecklistItem>) {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  }

  function cycleKind(item: DraftChecklistItem) {
    const nextIndex = (kindOrder.indexOf(item.kind) + 1) % kindOrder.length;
    updateItem(item.id, { kind: kindOrder[nextIndex] });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-semibold">Những điều đã làm</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Đánh dấu những gì đã trải nghiệm, phần chưa làm sẽ thành mục tiêu lần sau
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Gợi ý {draft.province ? `cho ${draft.province}` : "chung"}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addItem(s)}
              className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {draft.checklist.length === 0 && (
          <p className="rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
            Chưa có mục nào. Bấm vào gợi ý ở trên hoặc thêm trải nghiệm mới bên dưới.
          </p>
        )}
        {draft.checklist.map((item) => {
          const meta = checklistKindMeta(item.kind);
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
              <button
                type="button"
                onClick={() => cycleKind(item)}
                className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", meta.bgClass, meta.textClass)}
                title="Đổi loại"
              >
                {meta.label}
              </button>
              <input
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value })}
                placeholder="Tên trải nghiệm..."
                className="flex-1 bg-transparent text-sm font-medium outline-none"
              />
              <button
                type="button"
                onClick={() => updateItem(item.id, { done: !item.done })}
                className="flex shrink-0 items-center gap-1.5 text-xs"
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    item.done ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="hidden text-muted-foreground sm:inline">{item.done ? "Đã làm" : "Chưa làm"}</span>
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-[18px]" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => addItem("")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Plus className="size-[18px]" />
        Thêm trải nghiệm
      </button>

      {progress.total > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {progress.done}/{progress.total} đã hoàn thành
            </span>
            <span className="font-mono font-medium text-primary">{progress.percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-entity-shared"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

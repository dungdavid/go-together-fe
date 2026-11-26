"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { provinces, regionLabels, ProvinceRegion } from "@/lib/vietnam-provinces";
import { cn } from "@/lib/utils";

export function ProvinceCombobox({
  value,
  onChange,
  visitedNames,
}: {
  value: string | null;
  onChange: (province: string) => void;
  visitedNames: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return provinces.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<ProvinceRegion, typeof provinces> = { bac: [], trung: [], nam: [] };
    for (const p of filtered) groups[p.region].push(p);
    return groups;
  }, [filtered]);

  return (
    <div className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-2.5 text-left transition-colors hover:bg-secondary"
      >
        <div className="flex items-center gap-2.5">
          <Search className="size-[18px] text-muted-foreground" />
          <span className={cn("text-sm", value ? "font-medium" : "text-muted-foreground")}>
            {value ?? "Tìm tỉnh thành..."}
          </span>
        </div>
        <ChevronDown className={cn("size-[18px] text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full z-20 mt-1 max-h-64 w-full space-y-1 overflow-y-auto rounded-2xl bg-popover p-2 shadow-lg ring-1 ring-border">
          <div className="px-2 pb-1">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trong 63 tỉnh thành..."
              className="w-full rounded-lg bg-muted px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {(["bac", "trung", "nam"] as const).map((region) =>
            grouped[region].length > 0 ? (
              <div key={region}>
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {regionLabels[region]}
                </div>
                {grouped[region].map((p) => {
                  const isSelected = value === p.name;
                  const visited = visitedNames.has(p.asciiName);
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        onChange(p.name);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                        isSelected ? "bg-primary/15 font-medium" : "hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn("size-1.5 rounded-full", visited ? "bg-primary" : "bg-muted-foreground/40")} />
                        {p.name}
                      </span>
                      {isSelected ? (
                        <Check className="size-[18px] text-primary" />
                      ) : (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px]",
                            visited ? "bg-muted text-muted-foreground" : "text-muted-foreground",
                          )}
                        >
                          {visited ? "Đã đến" : "Chưa đi"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

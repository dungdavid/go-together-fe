import Image from "next/image";
import { Check, Heart, Lock, MapPin, MessageCircle, Share2, Sparkles, Star } from "lucide-react";
import { JourneyDraft, checklistKindMeta, checklistProgress } from "@/components/add-journey/journey-draft";
import { perspectiveConfig } from "@/components/dashboard/perspective-chip";
import { provinceSubRegion } from "@/lib/vietnam-provinces";
import { cn } from "@/lib/utils";

export function LivePreviewCard({ draft, step }: { draft: JourneyDraft; step: 1 | 2 | 3 }) {
  const progress = checklistProgress(draft.checklist);
  const perspective = perspectiveConfig(draft.perspective);
  const subRegion = draft.province ? provinceSubRegion[draft.province] : undefined;
  const cover = draft.photos.find((p) => p.isCover) ?? draft.photos[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="relative h-36 w-full bg-muted sm:h-48">
        {cover ? (
          <Image src={cover.previewUrl} alt={draft.placeName || "Ảnh bìa"} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <MapPin className="size-8 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md", perspective.bgClass, perspective.textClass)}>
            <Heart className="size-3" fill="currentColor" />
            {perspective.label}
          </span>
          {step === 3 && draft.memorableRating > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
              <Star className="size-3" fill="currentColor" />
              {draft.memorableRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <MapPin className="size-3" />
          {draft.province ?? "Chưa chọn tỉnh"}
          {subRegion && <span className="font-normal text-muted-foreground">· {subRegion}</span>}
        </div>
        <h4 className="font-heading text-lg leading-tight">{draft.placeName || "Chưa đặt tên địa điểm"}</h4>

        {progress.total > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="size-3 text-primary" />
                {progress.done}/{progress.total} trải nghiệm
              </span>
              <span className="font-mono text-primary">{progress.percent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-entity-shared" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}

        {step >= 2 && draft.checklist.length > 0 && (
          <ul className="space-y-1">
            {draft.checklist.map((item) => {
              const meta = checklistKindMeta(item.kind);
              return (
                <li key={item.id} className={cn("flex items-center justify-between text-xs", !item.done && "text-muted-foreground")}>
                  <span className="flex items-center gap-1.5 truncate">
                    {item.done ? (
                      <Check className="size-3 shrink-0 text-primary" />
                    ) : (
                      <span className="size-3 shrink-0 rounded-full border border-muted-foreground/40" />
                    )}
                    <span className="truncate">{item.label || "(chưa đặt tên)"}</span>
                  </span>
                  <span className={cn("shrink-0 text-[10px]", meta.textClass)}>{meta.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        {step === 3 && draft.story && (
          <p className="line-clamp-2 rounded-xl border border-border bg-muted/40 p-2.5 text-xs italic text-muted-foreground">
            “{draft.story}”
          </p>
        )}

        {step === 3 && draft.photos.length > 1 && (
          <div className="grid grid-cols-3 gap-1.5">
            {draft.photos.slice(0, 3).map((photo, i) => (
              <div key={photo.id} className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={photo.previewUrl} alt="" fill className="object-cover" unoptimized />
                {i === 2 && draft.photos.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold text-white">
                    +{draft.photos.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="size-3.5 fill-entity-shared text-entity-shared" /> 0
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" /> 0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="size-3.5" />
              {draft.privacy === "private" && <Lock className="size-3.5" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

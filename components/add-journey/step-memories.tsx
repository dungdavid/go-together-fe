"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, Lock, Globe, Star, X } from "lucide-react";
import { DraftPatch, DraftPhoto, JourneyDraft, makeId } from "@/components/add-journey/journey-draft";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 15;
const MAX_STORY = 500;

export function StepMemories({
  draft,
  onChange,
}: {
  draft: JourneyDraft;
  onChange: (patch: DraftPatch) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setPhotos(updater: (prev: DraftPhoto[]) => DraftPhoto[]) {
    onChange((prev) => ({ photos: updater(prev.photos) }));
  }

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    setPhotos((prev) => {
      const remainingSlots = MAX_PHOTOS - prev.length;
      const toAdd = imageFiles.slice(0, Math.max(0, remainingSlots));
      const newPhotos: DraftPhoto[] = toAdd.map((file, index) => ({
        id: makeId("photo"),
        file,
        previewUrl: URL.createObjectURL(file),
        isCover: prev.length === 0 && index === 0,
      }));
      return [...prev, ...newPhotos];
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      const next = prev.filter((p) => p.id !== id);
      if (next.length > 0 && !next.some((p) => p.isCover)) next[0].isCover = true;
      return next;
    });
  }

  function setCover(id: string) {
    setPhotos((prev) => prev.map((p) => ({ ...p, isCover: p.id === id })));
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Ảnh kỷ niệm</h3>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Đã thêm {draft.photos.length}/{MAX_PHOTOS} ảnh
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={draft.photos.length >= MAX_PHOTOS}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ImagePlus className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Chọn ảnh từ thiết bị</span>
            <span className="text-xs text-muted-foreground">
              Có thể chọn nhiều ảnh cùng lúc — ảnh sẽ được tải lên khi bạn lưu chuyến đi
            </span>
          </div>
        </button>

        {draft.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {draft.photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                <Image src={photo.previewUrl} alt="" fill unoptimized className="object-cover" />
                {photo.isCover ? (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                    <Star className="size-3" fill="currentColor" />
                    Ảnh bìa
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCover(photo.id)}
                    className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Đặt làm ảnh bìa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label="Xóa ảnh"
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="trip-story">
            Câu chuyện hành trình
          </label>
          <span className="text-xs text-muted-foreground">Giọng văn tự do</span>
        </div>
        <textarea
          id="trip-story"
          rows={4}
          maxLength={MAX_STORY}
          value={draft.story}
          onChange={(e) => onChange({ story: e.target.value })}
          placeholder="Cảm xúc, thời tiết, hoặc khoảnh khắc bất ngờ nhất..."
          className="w-full resize-none rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed outline-none ring-primary/40 focus:ring-2"
        />
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span className="italic">Gợi ý: Cảm xúc, thời tiết, hoặc khoảnh khắc bất ngờ nhất...</span>
          <span className="font-mono">
            {draft.story.length} / {MAX_STORY} ký tự
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="space-y-2.5 rounded-2xl bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mức độ đáng nhớ</span>
            {draft.memorableRating === 5 && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                Cực kỳ đáng nhớ ✨
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} sao`}
                onClick={() => onChange({ memorableRating: n })}
                className="transition-transform hover:scale-110"
              >
                <Star className={cn("size-6", n <= draft.memorableRating ? "fill-primary" : "fill-none text-muted-foreground")} />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2.5 rounded-2xl bg-muted/50 p-4">
          <span className="block text-sm font-medium">Ai được xem?</span>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-background/60 p-1">
            <button
              type="button"
              onClick={() => onChange({ privacy: "public" })}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-colors",
                draft.privacy === "public" ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              <Globe className="size-4" />
              Công khai
            </button>
            <button
              type="button"
              onClick={() => onChange({ privacy: "private" })}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-colors",
                draft.privacy === "private" ? "bg-card text-entity-shared shadow-sm" : "text-muted-foreground",
              )}
            >
              <Lock className="size-4" />
              Chỉ hai đứa
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

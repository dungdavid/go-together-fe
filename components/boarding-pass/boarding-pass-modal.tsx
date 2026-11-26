"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Map as MapIcon,
  RectangleHorizontal,
  RectangleVertical,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildBoardingPassData } from "@/lib/boarding-pass-data";
import { BoardingPassFormat, BoardingPassLayers, BoardingPassTheme } from "@/components/boarding-pass/types";
import { themeStyles } from "@/components/boarding-pass/theme-styles";
import { LandscapePassCard } from "@/components/boarding-pass/landscape-pass-card";
import { StoryPassCard } from "@/components/boarding-pass/story-pass-card";

const FORMAT_RESOLUTIONS: Record<BoardingPassFormat, { width: number; height: number; caption: string }> = {
  landscape: { width: 2400, height: 1260, caption: "Độ phân giải 2400×1260px · Tối ưu cho Facebook, Zalo & Instagram" },
  story: { width: 1080, height: 1920, caption: "Độ phân giải 1080×1920px · Tối ưu cho Facebook, Zalo & Instagram Story" },
};

const themeOrder: BoardingPassTheme[] = ["noir", "sunset", "kraft"];

export function BoardingPassModal({
  open,
  onClose,
  passengerLabel,
  coverPhotoUrl,
}: {
  open: boolean;
  onClose: () => void;
  passengerLabel?: string;
  coverPhotoUrl?: string;
}) {
  const [format, setFormat] = useState<BoardingPassFormat>("landscape");
  const [theme, setTheme] = useState<BoardingPassTheme>("noir");
  const [layers, setLayers] = useState<BoardingPassLayers>({
    footprintMap: true,
    regionStats: true,
    featuredBadge: true,
    coverPhoto: false,
  });
  const [toast, setToast] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(() => buildBoardingPassData({ passengerLabel, coverPhotoUrl }), [passengerLabel, coverPhotoUrl]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const toggleLayer = useCallback((key: keyof BoardingPassLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const captureNode = useCallback(async () => {
    const node = previewRef.current;
    if (!node) return null;
    const { toPng } = await import("html-to-image");
    const target = FORMAT_RESOLUTIONS[format];
    const pixelRatio = target.width / node.offsetWidth;
    return toPng(node, { pixelRatio, cacheBust: true });
  }, [format]);

  async function handleDownload() {
    setIsExporting(true);
    try {
      const dataUrl = await captureNode();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `boarding-pass-${format}.png`;
      link.click();
      setToast(format === "story" ? "Đã tải Story 9:16 về máy thành công" : "Đã tải Boarding Pass về máy thành công");
    } catch {
      setToast("Xuất ảnh thất bại, vui lòng thử lại");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleCopyImage() {
    try {
      const node = previewRef.current;
      if (!node) return;
      const { toBlob } = await import("html-to-image");
      const target = FORMAT_RESOLUTIONS[format];
      const pixelRatio = target.width / node.offsetWidth;
      const blob = await toBlob(node, { pixelRatio, cacheBust: true });
      if (!blob) throw new Error("no blob");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setToast("Đã sao chép ảnh vào bộ nhớ tạm");
    } catch {
      setToast("Trình duyệt không hỗ trợ sao chép ảnh");
    }
  }

  async function handleShareLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Boarding Pass của hai bạn", url });
        setToast("Đã mở hộp thoại chia sẻ");
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Đã sao chép liên kết");
    } catch {
      // user cancelled share sheet — no-op
    }
  }

  if (!open) return null;

  const resolution = FORMAT_RESOLUTIONS[format];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 p-2 backdrop-blur-md sm:p-4 lg:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#18181B] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_45px_-10px_rgba(255,90,60,0.18)]"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[480px] -translate-x-1/2 rounded-full bg-[#FF5A3C] opacity-[0.12] blur-[90px]" />

        <header className="relative z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#18181B]/70 px-6 py-5 backdrop-blur-md sm:px-8">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 animate-pulse rounded-full bg-[#FF5A3C]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5A3C]">Travel Passport · Kỷ Niệm</span>
            </div>
            <h2 className="font-heading text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">Boarding Pass của hai bạn</h2>
          </div>
          <button
            type="button"
            aria-label="Đóng cửa sổ"
            onClick={onClose}
            className="group flex size-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="size-5 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </header>

        <div className="grid flex-1 grid-cols-12 overflow-y-auto">
          {/* LEFT PREVIEW STAGE */}
          <div className="relative col-span-12 flex flex-col items-center justify-center overflow-hidden bg-[#0e0e10] p-4 sm:p-8 lg:col-span-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] opacity-40 [background-size:16px_16px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A3C] opacity-[0.14] blur-[110px]" />

            <div className={cn("relative flex w-full flex-col items-center", format === "story" ? "max-w-[380px]" : "max-w-[620px]")}>
              {format === "story" ? (
                <StoryPassCard ref={previewRef} data={data} theme={theme} layers={layers} />
              ) : (
                <LandscapePassCard ref={previewRef} data={data} theme={theme} layers={layers} />
              )}
            </div>

            <div className="relative mt-6 flex items-center gap-3">
              <span className="text-[11px] font-medium text-zinc-400">Xem trước phụ:</span>
              <button
                type="button"
                onClick={() => setFormat(format === "story" ? "landscape" : "story")}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
              >
                {format === "story" ? <RectangleHorizontal className="size-3.5 text-[#FF5A3C]" /> : <RectangleVertical className="size-3.5 text-[#FF5A3C]" />}
                <span className="text-xs font-semibold">
                  {format === "story" ? "Boarding Pass ngang (2400×1260)" : "Story 9:16 (1080×1920)"}
                </span>
              </button>
            </div>

            {toast && (
              <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
                <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#18181b]/95 px-4 py-2 text-xs text-emerald-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <Check className="size-4 text-emerald-400" />
                  <span>{toast}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CONTROL PANEL */}
          <div className="relative z-20 col-span-12 flex flex-col justify-between border-t border-white/[0.08] bg-[#18181B] p-6 lg:col-span-4 lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Định dạng xuất</span>
                  <span className="font-mono text-[10px] text-zinc-500">2 Tùy chọn</span>
                </div>
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-[#0e0e10]/80 p-1">
                  <button
                    type="button"
                    onClick={() => setFormat("landscape")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      format === "landscape" ? "bg-[#FF5A3C] font-semibold text-white shadow-sm" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <RectangleHorizontal className="size-4" />
                    <span>Pass (Ngang)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("story")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      format === "story" ? "bg-[#FF5A3C] font-semibold text-white shadow-sm" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <RectangleVertical className="size-4" />
                    <span>Story 9:16</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Giao diện màu sắc</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {themeOrder.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTheme(id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-2.5 transition-all",
                        theme === id
                          ? "border-[#FF5A3C] bg-white/[0.04] text-white shadow-[0_0_15px_rgba(255,90,60,0.15)]"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white",
                      )}
                    >
                      <div className={cn("size-7 rounded-full", themeStyles[id].swatchClassName)}>
                        {id === "noir" && <div className="m-auto mt-[9px] size-2.5 rounded-full bg-[#FF5A3C]" />}
                      </div>
                      <span className="text-xs font-semibold">{themeStyles[id].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Lớp hiển thị</span>
                <div className="flex flex-col gap-2.5">
                  <LayerToggle icon={MapIcon} label="Bản đồ dấu chân" checked={layers.footprintMap} onToggle={() => toggleLayer("footprintMap")} />
                  <LayerToggle icon={SlidersHorizontal} label="Số liệu 3 miền" checked={layers.regionStats} onToggle={() => toggleLayer("regionStats")} />
                  <LayerToggle icon={Award} label="Huy hiệu nổi bật" checked={layers.featuredBadge} onToggle={() => toggleLayer("featuredBadge")} />
                  <LayerToggle icon={ImageIcon} label="Ảnh bìa chuyến gần nhất" checked={layers.coverPhoto} onToggle={() => toggleLayer("coverPhoto")} disabled={!coverPhotoUrl} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2.5 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5A3C] to-[#FB7185] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.45)] transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
              >
                {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                <span>{isExporting ? "Đang xuất ảnh..." : "Tải PNG Chất Lượng Cao"}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-xs font-medium text-zinc-300 transition-all hover:bg-white/[0.09] hover:text-white active:scale-[0.98]"
                >
                  <Copy className="size-4 text-zinc-400" />
                  <span>Sao chép ảnh</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-xs font-medium text-zinc-300 transition-all hover:bg-white/[0.09] hover:text-white active:scale-[0.98]"
                >
                  <Share2 className="size-4 text-zinc-400" />
                  <span>Chia sẻ link</span>
                </button>
              </div>
              <p className="mt-1 text-center font-mono text-[10px] text-zinc-500">{resolution.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerToggle({
  icon: Icon,
  label,
  checked,
  onToggle,
  disabled,
}: {
  icon: typeof MapIcon;
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5 transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/[0.04]",
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn("size-4", checked ? "text-[#FF5A3C]" : "text-zinc-500")} />
        <span className={cn("text-xs", checked ? "text-zinc-200" : "text-zinc-400")}>{label}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onToggle}
        className={cn("relative h-5 w-9 rounded-full p-0.5 transition-colors", checked ? "bg-[#FF5A3C]" : "bg-zinc-700")}
      >
        <div className={cn("size-4 rounded-full bg-white shadow-md transition-transform", checked ? "translate-x-4" : "translate-x-0")} />
      </button>
    </label>
  );
}

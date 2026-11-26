import { forwardRef } from "react";
import { Compass } from "lucide-react";
import { BoardingPassData, BoardingPassLayers, BoardingPassTheme } from "@/components/boarding-pass/types";
import { themeStyles, ThemeStyle } from "@/components/boarding-pass/theme-styles";
import { VietnamSilhouette } from "@/components/boarding-pass/vietnam-silhouette";

export const LandscapePassCard = forwardRef<
  HTMLDivElement,
  { data: BoardingPassData; theme: BoardingPassTheme; layers: BoardingPassLayers }
>(function LandscapePassCard({ data, theme, layers }, ref) {
  const style = themeStyles[theme];

  return (
    <div
      ref={ref}
      className="flex w-full flex-col overflow-hidden rounded-2xl border shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(255,90,60,0.14)] md:flex-row"
      style={{ borderColor: style.borderColor, color: style.textColor }}
    >
      {/* MAIN PART */}
      <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6" style={{ background: style.cardBackground }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: style.borderColor }}>
          <div className="flex items-center gap-2">
            <div
              className="flex size-6 items-center justify-center rounded-full"
              style={{ backgroundColor: `${style.accentColor}1a`, color: style.accentColor }}
            >
              <Compass className="size-3.5" />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: style.mutedTextColor }}>
              Nhật Ký Xê Dịch Airlines
            </span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: style.accentColor }}>
            <span className="font-mono text-xs font-bold tracking-wider">BOARDING PASS</span>
            <svg className="size-4 rotate-45" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>
        </div>

        <div className="pt-3">
          <span className="block font-label text-[10px] font-medium uppercase tracking-widest" style={{ color: style.mutedTextColor }}>
            Hành khách
          </span>
          <h3 className="mt-0.5 font-heading text-xl font-bold tracking-tight sm:text-2xl">{data.passengerLabel}</h3>
        </div>

        <div className="my-4 flex items-center justify-between rounded-xl border p-3" style={{ borderColor: style.borderColor, backgroundColor: "rgba(255,255,255,0.02)" }}>
          <div className="flex flex-col">
            <span className="font-mono text-2xl font-extrabold tracking-tight sm:text-3xl">HAN</span>
            <span className="text-xs" style={{ color: style.mutedTextColor }}>Hà Nội · {data.sinceYear}</span>
          </div>
          <div className="relative mx-4 flex flex-1 flex-col items-center">
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute top-1/2 w-full border-t border-dashed" style={{ borderColor: `${style.accentColor}66` }} />
              <div
                className="relative z-10 flex size-7 items-center justify-center rounded-full border shadow-[0_0_12px_rgba(255,90,60,0.3)]"
                style={{ borderColor: `${style.accentColor}80`, color: style.accentColor, backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <svg className="size-3.5 rotate-90" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </div>
            </div>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: style.accentColor }}>
              Chuyến bay kỷ niệm
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-mono text-2xl font-extrabold tracking-tight sm:text-3xl">SGN</span>
            <span className="text-xs" style={{ color: style.mutedTextColor }}>TP.HCM · Tiếp tục</span>
          </div>
        </div>

        <div className="relative px-1 py-2">
          {layers.footprintMap && (
            <VietnamSilhouette accentColor={style.accentColor} className="pointer-events-none absolute -top-6 right-1 h-28 w-20 opacity-25" />
          )}
          <div className="relative z-10 grid grid-cols-4 gap-2">
            <StatCol style={style} label="Tỉnh thành" value={`${data.provincesVisited}`} suffix={`/${data.provincesTotal}`} />
            <StatCol style={style} label="Điểm đến" value={`${data.destinationsCount}`} />
            <StatCol style={style} label="Trải nghiệm" value={`${data.experiencesCount}`} />
            <StatCol style={style} label="Huy hiệu" value={`${data.badgesEarned}`} accent />
          </div>
        </div>

        {layers.regionStats && (
          <div className="mt-1 flex flex-col justify-between gap-2 border-t pt-3 font-mono text-[10px] sm:flex-row sm:items-center" style={{ borderColor: style.borderColor }}>
            <div className="flex items-center gap-2" style={{ color: style.mutedTextColor }}>
              {data.regionPercents.map((r, i) => (
                <span key={r.label} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-50">•</span>}
                  <span className="font-medium" style={{ color: style.textColor }}>
                    {r.label.toUpperCase()} {r.percent}%
                  </span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <LegendDot color="#FB7185" label={`Chung ${data.shared}`} />
              <LegendDot color="#38BDF8" label={`Sơn ${data.partnerA}`} />
              <LegendDot color="#A78BFA" label={`Thương ${data.partnerB}`} />
            </div>
          </div>
        )}

        {layers.coverPhoto && data.coverPhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverPhotoUrl} alt="" className="mt-3 h-20 w-full rounded-xl object-cover" crossOrigin="anonymous" />
        )}
      </div>

      {/* NOTCH SEPARATOR */}
      <div className="relative hidden w-0 flex-col items-center justify-between border-r border-dashed md:flex" style={{ borderColor: "rgba(113,113,122,0.6)" }}>
        <div className="absolute -left-2.5 -top-px h-3 w-5 rounded-b-full border-b border-l border-r" style={{ backgroundColor: "#0e0e10", borderColor: style.borderColor }} />
        <div className="absolute -bottom-px -left-2.5 h-3 w-5 rounded-t-full border-l border-r border-t" style={{ backgroundColor: "#0e0e10", borderColor: style.borderColor }} />
      </div>

      {/* STUB */}
      <div
        className="flex w-full flex-col items-center justify-between border-t border-dashed p-4 text-center md:w-[175px] md:border-none"
        style={{ backgroundColor: "#131316", borderColor: "rgba(113,113,122,0.6)", color: style.textColor }}
      >
        <div className="grid w-full grid-cols-3 gap-2 pt-1 md:grid-cols-1">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">CỔNG</span>
            <span className="font-mono text-sm font-bold">{data.gateCode}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">GHẾ</span>
            <span className="font-mono text-sm font-bold" style={{ color: style.accentColor }}>2A &amp; 2B</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">HẠNG VÉ</span>
            <span className="mt-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-amber-300">
              SOULMATE
            </span>
          </div>
        </div>

        {layers.featuredBadge && (
          <div className="relative my-3 py-1">
            <div
              className="flex size-20 -rotate-12 select-none flex-col items-center justify-center rounded-full border-2 border-dashed shadow-[0_0_15px_rgba(255,90,60,0.15)]"
              style={{ borderColor: `${style.accentColor}b3`, color: style.accentColor, backgroundColor: `${style.accentColor}05` }}
            >
              <div className="flex items-center gap-0.5 text-[8px] font-mono">
                <span>★</span>
                <span className="font-bold uppercase tracking-widest">VIETNAM</span>
                <span>★</span>
              </div>
              <span className="my-0.5 font-mono text-[11px] font-extrabold tracking-wider">EXPEDITION</span>
              <span className="font-mono text-[9px] font-bold">{data.currentYear}</span>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col items-center">
          <div className="flex h-9 w-full items-end justify-center gap-[2px] px-2 opacity-80">
            {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
              <span key={i} className="inline-block bg-zinc-300" style={{ width: `${w}px`, height: `${24 + (i % 3) * 2}px` }} />
            ))}
          </div>
          <span className="mt-1 font-mono text-[9px] tracking-widest text-zinc-500">{data.barcodeCode}</span>
        </div>
      </div>
    </div>
  );
});

function StatCol({
  style,
  label,
  value,
  suffix,
  accent,
}: {
  style: ThemeStyle;
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-label text-[9px] uppercase tracking-wider" style={{ color: style.mutedTextColor }}>
        {label}
      </span>
      <span className="mt-0.5 font-heading text-lg font-bold tracking-tight" style={{ color: accent ? style.accentColor : style.textColor }}>
        {value}
        {suffix && (
          <span className="text-xs font-normal" style={{ color: style.mutedTextColor }}>
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

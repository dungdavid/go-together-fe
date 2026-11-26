import { forwardRef } from "react";
import { Compass } from "lucide-react";
import { BoardingPassData, BoardingPassLayers, BoardingPassTheme } from "@/components/boarding-pass/types";
import { themeStyles, ThemeStyle } from "@/components/boarding-pass/theme-styles";
import { VietnamSilhouette } from "@/components/boarding-pass/vietnam-silhouette";

export const StoryPassCard = forwardRef<
  HTMLDivElement,
  { data: BoardingPassData; theme: BoardingPassTheme; layers: BoardingPassLayers }
>(function StoryPassCard({ data, theme, layers }, ref) {
  const style = themeStyles[theme];

  return (
    <div
      ref={ref}
      className="flex w-full flex-col overflow-hidden rounded-3xl border p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(255,90,60,0.14)]"
      style={{ background: style.cardBackground, borderColor: style.borderColor, color: style.textColor }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: style.borderColor }}>
        <div className="flex items-center gap-2">
          <div
            className="flex size-6 items-center justify-center rounded-full"
            style={{ backgroundColor: `${style.accentColor}1a`, color: style.accentColor }}
          >
            <Compass className="size-3.5" />
          </div>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest" style={{ color: style.mutedTextColor }}>
            Nhật Ký Xê Dịch
          </span>
        </div>
        <span
          className="rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
          style={{ borderColor: `${style.accentColor}4d`, backgroundColor: `${style.accentColor}1a`, color: style.accentColor }}
        >
          Story Kỷ Niệm
        </span>
      </div>

      <div className="pt-3.5 text-center">
        <span className="block font-label text-[10px] font-medium uppercase tracking-widest" style={{ color: style.mutedTextColor }}>
          Hành trình của
        </span>
        <h3 className="mt-0.5 font-heading text-[22px] font-bold tracking-tight">{data.passengerLabel}</h3>
      </div>

      <div className="my-3 rounded-2xl border p-3 text-center" style={{ borderColor: style.borderColor, backgroundColor: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-lg font-bold">HAN</span>
          <div className="flex items-center gap-1.5" style={{ color: style.accentColor }}>
            <span className="w-5 border-t border-dashed" style={{ borderColor: `${style.accentColor}66` }} />
            <svg className="size-3.5 rotate-90" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span className="w-5 border-t border-dashed" style={{ borderColor: `${style.accentColor}66` }} />
          </div>
          <span className="font-mono text-lg font-bold">SGN</span>
        </div>
        <p className="mt-1 font-heading text-lg font-bold">
          {data.provincesVisited}/{data.provincesTotal} tỉnh thành
        </p>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider" style={{ color: style.accentColor }}>
          HAN ✈ SGN · Chặng đường thanh xuân
        </span>
      </div>

      {layers.footprintMap && (
        <div className="relative flex items-center justify-center py-2">
          <VietnamSilhouette accentColor={style.accentColor} className="h-36 w-28 opacity-80 drop-shadow-[0_0_12px_rgba(255,90,60,0.3)]" />
        </div>
      )}

      <div className="my-2 grid grid-cols-2 gap-2">
        <StatBox style={style} label="Tỉnh thành" value={`${data.provincesVisited}`} suffix={`/${data.provincesTotal}`} caption={data.regionPercents.map((r) => `${r.label} ${r.percent}%`).join(" · ")} />
        <StatBox style={style} label="Điểm đến" value={`${data.destinationsCount} tọa độ`} caption="3 vùng miền" />
        <StatBox style={style} label="Trải nghiệm" value={`${data.experiencesCount} khoảnh khắc`} caption={`${Math.round(data.experiencesCount / 2)} hình ảnh check-in`} />
        <StatBox style={style} label="Huy hiệu" value={`${data.badgesEarned} danh hiệu`} caption={data.badgeRankLabel} accent />
      </div>

      {layers.regionStats && (
        <div
          className="flex items-center justify-center gap-3 border-y py-1.5 font-mono text-[10px]"
          style={{ borderColor: style.borderColor }}
        >
          <LegendDot color="#FB7185" label={`Cùng nhau ${data.shared}`} />
          <LegendDot color="#38BDF8" label={`Bạn trai ${data.partnerA}`} />
          <LegendDot color="#A78BFA" label={`Bạn gái ${data.partnerB}`} />
        </div>
      )}

      <div className="relative mt-3 flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: "rgba(113,113,122,0.5)" }}>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 font-mono text-[9px]">
            <span style={{ color: style.mutedTextColor }}>GHẾ:</span>
            <span className="font-bold" style={{ color: style.accentColor }}>2A &amp; 2B</span>
            <span style={{ color: style.mutedTextColor }}>|</span>
            <span style={{ color: style.mutedTextColor }}>CỔNG:</span>
            <span className="font-bold">{data.gateCode}</span>
          </div>
          <span className="mt-1 font-mono text-[8px] tracking-widest" style={{ color: style.mutedTextColor }}>
            {data.barcodeCode}
          </span>
        </div>
        {layers.featuredBadge && (
          <div
            className="flex size-14 -rotate-6 select-none flex-col items-center justify-center rounded-full border border-dashed text-center"
            style={{ borderColor: `${style.accentColor}b3`, color: style.accentColor, backgroundColor: `${style.accentColor}08` }}
          >
            <span className="text-[7px] font-mono font-bold tracking-widest">VIETNAM</span>
            <span className="font-mono text-[8px] font-extrabold tracking-wider">EXPEDITION</span>
            <span className="font-mono text-[7px] font-bold">{data.currentYear}</span>
          </div>
        )}
      </div>

      {layers.coverPhoto && data.coverPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.coverPhotoUrl} alt="" className="mt-2 h-24 w-full rounded-xl object-cover" crossOrigin="anonymous" />
      )}

      <div className="mt-2 pt-2 text-center font-mono text-[10px]" style={{ color: style.mutedTextColor }}>
        nhatkyxedich · Hành trình vẫn tiếp tục… ✨
      </div>
    </div>
  );
});

function StatBox({
  style,
  label,
  value,
  suffix,
  caption,
  accent,
}: {
  style: ThemeStyle;
  label: string;
  value: string;
  suffix?: string;
  caption: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border p-2" style={{ borderColor: style.borderColor, backgroundColor: "rgba(255,255,255,0.02)" }}>
      <span className="block font-label text-[9px] uppercase tracking-wider" style={{ color: style.mutedTextColor }}>
        {label}
      </span>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="font-heading text-base font-bold" style={{ color: accent ? style.accentColor : style.textColor }}>
          {value}
        </span>
        {suffix && (
          <span className="text-[10px]" style={{ color: style.mutedTextColor }}>
            {suffix}
          </span>
        )}
      </div>
      <span className="mt-0.5 block font-mono text-[9px]" style={{ color: accent ? style.accentColor : style.mutedTextColor }}>
        {caption}
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

import Image from "next/image";
import { Calendar, CheckCircle2, CirclePlus, Images, Map, MapPin, TrendingUp, Trophy } from "lucide-react";
import { Place } from "@/lib/types";
import { PerspectiveChip } from "@/components/dashboard/perspective-chip";
import { journeyStats, nextBadge } from "@/lib/dashboard-data";
import { formatVisitedDate } from "@/lib/format";

export function SuccessScreen({
  place,
  isNewProvince,
  checklistCreatedCount,
  onAddAnother,
  onViewMap,
}: {
  place: Place;
  isNewProvince: boolean;
  checklistCreatedCount: number;
  onAddAnother: () => void;
  onViewMap: () => void;
}) {
  const provinceDelta = isNewProvince ? 1 : 0;
  const newMomentsTotal = nextBadge.current + checklistCreatedCount;

  return (
    <div className="flex flex-col items-center p-6 text-center sm:p-10">
      <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-secondary p-1 shadow-[0_0_40px_-5px_rgba(255,90,60,0.45)]">
        <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary to-entity-shared p-1">
          <div className="flex size-full items-center justify-center rounded-full bg-background">
            <CheckCircle2 className="size-9 text-primary" fill="currentColor" />
          </div>
        </div>
      </div>

      <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Chuyến đi đã ghi nhận</span>
      <h2 className="font-heading text-3xl font-semibold tracking-tight">Đã thêm vào hành trình!</h2>

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-base font-medium text-muted-foreground">{place.name}</span>
        <span className="size-1 rounded-full bg-border" />
        <PerspectiveChip perspective={place.perspective} />
      </div>

      {checklistCreatedCount > 0 && (
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-secondary px-4 py-2 shadow-md">
          <Trophy className="size-[18px] text-primary" />
          <span className="text-sm">
            Mở khoá danh hiệu: <strong className="font-semibold text-primary">Mê trải nghiệm ✨</strong>
          </span>
        </div>
      )}

      <div className="mb-6 grid w-full grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatTile
          label="Tỉnh thành"
          value={`${journeyStats.provincesVisited + provinceDelta}`}
          suffix={`/${journeyStats.provincesTotal}`}
          icon={TrendingUp}
          hint={provinceDelta > 0 ? "+1 tỉnh mới" : "Tỉnh đã đến"}
        />
        <StatTile
          label="Điểm khám phá"
          value={`${journeyStats.destinationsCount + 1}`}
          suffix=" điểm"
          icon={CirclePlus}
          hint="1 địa danh"
        />
        <StatTile
          label="Kho trải nghiệm"
          value={`${newMomentsTotal}`}
          suffix=" khoảnh khắc"
          icon={Images}
          hint={`+${checklistCreatedCount} hoạt động`}
        />
      </div>

      <div className="mb-8 flex w-full items-center justify-between gap-4 rounded-2xl bg-secondary/60 p-3.5 text-left">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            {place.coverPhotoUrl && <Image src={place.coverPhotoUrl} alt={place.name} fill unoptimized className="object-cover" />}
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate text-sm font-semibold">{place.name}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {place.visitedAt ? formatVisitedDate(place.visitedAt) : "Chưa đặt ngày"}
              </span>
              <span className="size-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Images className="size-3.5" />
                {place.photos.length} hình ảnh
              </span>
            </div>
          </div>
        </div>
        <span className="hidden shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-primary sm:inline">Đã lưu trữ</span>
      </div>

      <div className="flex w-full flex-col-reverse items-center justify-center gap-3.5 sm:flex-row">
        <button
          type="button"
          onClick={onAddAnother}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary/70 sm:w-auto"
        >
          <CirclePlus className="size-[18px]" />
          Thêm chuyến khác
        </button>
        <button
          type="button"
          onClick={onViewMap}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared px-7 py-3 text-sm font-medium text-white shadow-[0_0_25px_-3px_rgba(255,90,60,0.45)] transition-all hover:brightness-110 sm:w-auto"
        >
          <Map className="size-[18px]" />
          Xem trên bản đồ
        </button>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  suffix,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  suffix: string;
  hint: string;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary/60 p-5 text-center transition-colors hover:bg-secondary">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="font-sans text-3xl font-semibold tabular-nums">
        {value}
        <span className="text-sm font-normal text-muted-foreground">{suffix}</span>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
        <Icon className="size-3" />
        {hint}
      </span>
    </div>
  );
}

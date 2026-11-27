"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  Cloud,
  CloudRain,
  CloudSun,
  Compass,
  Heart,
  ImageOff,
  MapPin,
  MessageCircle,
  PartyPopper,
  PlaneTakeoff,
  Play,
  Star,
  Sun,
  Ticket,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import JourneyMap from "@/components/dashboard/journey-map-loader";
import { PerspectiveChip } from "@/components/dashboard/perspective-chip";
import { BoardingPassModal } from "@/components/boarding-pass/boarding-pass-modal";
import { useAuth } from "@/lib/auth-context";
import { usePlace, usePlaces } from "@/lib/api";
import type { Perspective } from "@/lib/types";
import { checklistProgress, formatVisitedDate } from "@/lib/format";
import {
  coverageSplit,
  foodHighlights,
  foodStats,
  journeyStats,
  nextBadge,
  passportInfo,
  regionProgress,
  totalPhotosArchived,
  weatherForecast,
  type DayForecast,
} from "@/lib/dashboard-data";

const tileBase =
  "rounded-3xl p-6 bg-card border border-border relative overflow-hidden shadow-sm";

const weatherIcons: Record<DayForecast["condition"], typeof Sun> = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
};

const ALL_PERSPECTIVES: Perspective[] = ["shared", "partnerA", "partnerB"];

export default function HomePage() {
  const { data: places, isLoading } = usePlaces();
  const { data: latestTrip } = usePlace("ta-xua");
  const { user } = useAuth();
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [mapFilters, setMapFilters] = useState<Set<Perspective>>(new Set(ALL_PERSPECTIVES));

  function toggleMapFilter(perspective: Perspective) {
    setMapFilters((prev) => {
      const next = new Set(prev);
      if (next.has(perspective)) next.delete(perspective);
      else next.add(perspective);
      return next;
    });
  }

  const recentPlaces = places
    ? [...places].sort((a, b) => ((a.visitedAt ?? "") < (b.visitedAt ?? "") ? 1 : -1)).slice(0, 4)
    : [];

  const mapPlaces = (places ?? []).filter((place) => mapFilters.has(place.perspective));

  const coverageTotal = coverageSplit.shared + coverageSplit.partnerA + coverageSplit.partnerB;
  const coveragePercent = Math.round((journeyStats.provincesVisited / journeyStats.provincesTotal) * 100);
  const circumference = 2 * Math.PI * 42;
  const sharedLen = (coverageSplit.shared / journeyStats.provincesTotal) * circumference;
  const partnerALen = (coverageSplit.partnerA / journeyStats.provincesTotal) * circumference;
  const partnerBLen = (coverageSplit.partnerB / journeyStats.provincesTotal) * circumference;

  const tripProgress = latestTrip ? checklistProgress(latestTrip) : null;

  return (
    <div className="pb-24 md:pb-10">
      {/* HERO */}
      <section className="px-4 pt-6 pb-6 md:px-8">
        <div className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Hành trình của
              </span>
            </div>
            <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
              {journeyStats.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Từ {journeyStats.sinceYear}</span>
              <span className="text-border">/</span>
              <span>{journeyStats.destinationsCount} điểm đến</span>
              <span className="text-border">/</span>
              <span>{journeyStats.experiencesCount} trải nghiệm</span>
              <span className="text-border">/</span>
              <span className="font-medium text-foreground">{journeyStats.provincesVisited} tỉnh thành</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-secondary/70 p-2">
            <PerspectiveChip perspective="shared" />
            <PerspectiveChip perspective="partnerA" />
            <PerspectiveChip perspective="partnerB" />
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="grid grid-cols-12 auto-rows-min gap-4 px-4 pb-10 md:gap-6 md:px-8">
        {/* 1. MAP TILE */}
        <div className={`${tileBase} col-span-12 lg:col-span-8 lg:row-span-2 flex min-h-[460px] flex-col justify-between`}>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-4xl font-semibold tabular-nums tracking-tight">
                  {journeyStats.provincesVisited}
                  <span className="text-xl font-medium text-muted-foreground">/{journeyStats.provincesTotal}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-strong">
                  <TrendingUp className="size-3.5" />+{journeyStats.newThisYear} trong 2026
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tỉnh thành Việt Nam đã lưu dấu
              </p>
            </div>

            <div className="hidden flex-col gap-1 rounded-2xl bg-secondary/70 p-3 sm:flex">
              <LegendFilterRow
                colorClass="bg-entity-shared"
                label={`Cùng nhau (${coverageSplit.shared})`}
                checked={mapFilters.has("shared")}
                onToggle={() => toggleMapFilter("shared")}
              />
              <LegendFilterRow
                colorClass="bg-entity-partner-a"
                label={`Bạn trai (${coverageSplit.partnerA})`}
                checked={mapFilters.has("partnerA")}
                onToggle={() => toggleMapFilter("partnerA")}
              />
              <LegendFilterRow
                colorClass="bg-entity-partner-b"
                label={`Bạn gái (${coverageSplit.partnerB})`}
                checked={mapFilters.has("partnerB")}
                onToggle={() => toggleMapFilter("partnerB")}
              />
              <LegendRow colorClass="bg-muted-foreground/40" label={`Chưa đặt chân (${journeyStats.provincesTotal - coverageTotal})`} muted />
            </div>
          </div>

          <div className="relative z-10 my-3 h-80 w-full overflow-hidden rounded-2xl sm:h-96">
            <JourneyMap places={mapPlaces} />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center justify-between gap-3 rounded-2xl bg-secondary/70 p-3 sm:flex-row">
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                type="button"
                aria-label="Phát hoạt ảnh hành trình lũy kế"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20"
              >
                <Play className="size-4" />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Hành trình lũy kế</span>
                <span className="text-xs text-muted-foreground">Mốc hiện tại: Tháng 10/2026</span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-3 px-2 sm:w-7/12">
              {["2019", "2021", "2023", "2024", "2025"].map((year) => (
                <span key={year} className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  {year}
                </span>
              ))}
              <div className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                <span className="size-1.5 animate-ping rounded-full bg-primary-foreground" />
                2026
              </div>
            </div>
          </div>
        </div>

        {/* 2. COVERAGE RING TILE */}
        <div className={`${tileBase} col-span-12 sm:col-span-6 lg:col-span-4 flex min-h-[240px] flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Độ phủ Việt Nam</span>
            <Compass className="size-[18px] text-primary" />
          </div>
          <div className="relative my-2 flex items-center justify-center">
            <svg className="size-36 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" strokeWidth="11" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="var(--color-entity-shared)" strokeWidth="11" strokeLinecap="round"
                strokeDasharray={`${sharedLen} ${circumference}`}
              />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="var(--color-entity-partner-a)" strokeWidth="11"
                strokeDasharray={`${partnerALen} ${circumference}`}
                strokeDashoffset={-sharedLen}
              />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="var(--color-entity-partner-b)" strokeWidth="11" strokeLinecap="round"
                strokeDasharray={`${partnerBLen} ${circumference}`}
                strokeDashoffset={-(sharedLen + partnerALen)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-sans text-3xl font-semibold tabular-nums tracking-tight">{coveragePercent}%</span>
              <span className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {journeyStats.provincesVisited}/{journeyStats.provincesTotal} Tỉnh
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
            <LegendRow colorClass="bg-entity-shared" label={`Chung: ${coverageSplit.shared}`} />
            <LegendRow colorClass="bg-entity-partner-a" label={`Bạn trai: ${coverageSplit.partnerA}`} />
            <LegendRow colorClass="bg-entity-partner-b" label={`Bạn gái: ${coverageSplit.partnerB}`} />
          </div>
        </div>

        {/* 3. REGIONS TILE */}
        <div className={`${tileBase} col-span-12 sm:col-span-6 lg:col-span-4 flex min-h-[240px] flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiến độ 3 miền</span>
            <Compass className="size-[18px] text-entity-partner-a" />
          </div>
          <div className="my-auto flex flex-col gap-3.5">
            {regionProgress.map((region) => {
              const percent = Math.round((region.visited / region.total) * 100);
              return (
                <div key={region.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{region.name}</span>
                    {region.total > 0 && region.visited > 0 ? (
                      <span className="text-muted-foreground">
                        {region.visited}/{region.total} tỉnh <span className="font-semibold text-primary">({percent}%)</span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Chưa khám phá</span>
                    )}
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
            <span className="text-muted-foreground">Kế hoạch mùa khô 2027</span>
            <a href="#" className="inline-flex items-center gap-1 font-medium text-primary hover:text-foreground">
              Lên lịch trình Miền Nam <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* 4. LATEST TRIP TILE */}
        <div className="relative col-span-12 flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-md lg:col-span-4 lg:row-span-2">
          {latestTrip ? (
            <>
              {latestTrip.coverPhotoUrl && (
                <Image
                  src={latestTrip.coverPhotoUrl}
                  alt={latestTrip.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="-z-20 object-cover"
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/20" />

              <div className="relative z-10 flex items-center justify-between">
                <PerspectiveChip perspective={latestTrip.perspective} className="bg-white/15 text-white" />
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-wider text-white/90">
                  Tháng 10/2026
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80">
                  <MapPin className="size-3.5" />
                  {latestTrip.region}
                </div>
                <h2 className="font-heading text-2xl font-medium text-white drop-shadow-md">{latestTrip.name}</h2>
                <p className="line-clamp-2 text-sm text-white/80">{latestTrip.notes}</p>
                <div className="flex items-center justify-between border-t border-white/15 pt-3">
                  <div className="flex items-center gap-3 text-xs text-white/90">
                    <span className="flex items-center gap-1"><Heart className="size-3.5 fill-rose-400 text-rose-400" /> 31</span>
                    <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {tripProgress?.done ?? 6}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="size-3.5 text-sky-400" /> 11</span>
                  </div>
                  <Link
                    href={`/places/${latestTrip.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    Chi tiết chặng <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Skeleton className="absolute inset-0" />
          )}
        </div>

        {/* 5. FOOD TILE */}
        <div className={`${tileBase} col-span-12 sm:col-span-6 lg:col-span-4 flex min-h-[220px] flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ẩm thực đã thử</span>
            <UtensilsCrossed className="size-[18px] text-muted-foreground" />
          </div>
          <div className="my-1 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-semibold tabular-nums">{foodStats.totalDishes}</span>
            <span className="text-sm text-muted-foreground">món ngon bản địa đặc trưng</span>
          </div>
          <div
            className="flex items-center gap-3 overflow-x-auto py-1"
            tabIndex={0}
            role="region"
            aria-label="Danh sách món ăn đã thử, cuộn ngang"
          >
            {foodHighlights.map((food) => (
              <div key={food.id} className="flex shrink-0 flex-col items-center gap-1.5">
                <div className="size-12 overflow-hidden rounded-full border border-border">
                  <Image src={food.photoUrl} alt={food.name} width={48} height={48} className="size-full object-cover" />
                </div>
                <span className="max-w-[64px] truncate text-center text-[10px] text-muted-foreground">{food.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
            <span>{foodStats.exploreLabel}</span>
            <span>{foodStats.ratingLabel}</span>
          </div>
        </div>

        {/* 6. NEXT BADGE TILE */}
        <div className={`${tileBase} col-span-12 sm:col-span-6 lg:col-span-4 flex min-h-[220px] flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Huy hiệu tiếp theo</span>
            <Award className="size-[18px] text-primary" />
          </div>
          <div className="my-auto flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary">
              <Award className="size-7 text-primary-foreground" />
            </div>
            <div className="flex w-full flex-col gap-1">
              <span className="text-base font-semibold leading-tight">{nextBadge.name}</span>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tiến độ</span>
                <span className="font-bold text-primary">{nextBadge.current}/{nextBadge.total} ({Math.round((nextBadge.current / nextBadge.total) * 100)}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(nextBadge.current / nextBadge.total) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-secondary p-2 text-xs text-muted-foreground">
            <PartyPopper className="size-4 text-amber-500" />
            {nextBadge.hint}
          </div>
        </div>

        {/* 7. WEATHER TILE */}
        <div className={`${tileBase} col-span-12 sm:col-span-6 lg:col-span-4 flex min-h-[220px] flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thời tiết điểm hẹn tới</span>
              <span className="mt-0.5 text-sm font-medium">{weatherForecast.destination}</span>
            </div>
            <CloudSun className="size-5 text-muted-foreground" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div>
              <span className="font-sans text-2xl font-semibold tabular-nums">
                {weatherForecast.tempC}°<span className="text-xl font-normal text-muted-foreground">C</span>
              </span>
              <span className="block text-sm text-muted-foreground">{weatherForecast.condition}</span>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">{weatherForecast.tripMonthLabel}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 border-t border-border pt-2 text-center">
            {weatherForecast.days.map((day) => {
              const Icon = weatherIcons[day.condition];
              return (
                <div
                  key={day.label}
                  className={`flex flex-col items-center gap-1 rounded-lg p-1 ${day.isHighlighted ? "bg-secondary ring-1 ring-primary/30" : "bg-secondary/50"}`}
                >
                  <span className={`text-[10px] ${day.isHighlighted ? "font-semibold text-primary" : "text-muted-foreground"}`}>{day.label}</span>
                  <Icon className="size-[15px] text-amber-500" />
                  <span className={`text-[11px] ${day.isHighlighted ? "font-bold" : ""}`}>{day.tempC}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. RECENT PLACES TILE */}
        <div className={`${tileBase} col-span-12 lg:col-span-8 flex min-h-[300px] flex-col justify-between`}>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Địa điểm gần đây</span>
              <span className="size-1.5 rounded-full bg-primary" />
            </div>
            <Link href="/places" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-foreground">
              Xem tất cả {journeyStats.destinationsCount} trạm dừng <ArrowRight className="size-[15px]" />
            </Link>
          </div>

          <div className="my-1 flex flex-col divide-y divide-border">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-1 h-14 w-full" />)
              : recentPlaces.map((place) => {
                  const progress = checklistProgress(place);
                  return (
                    <Link
                      key={place.id}
                      href={`/places/${place.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-secondary/70"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                          {place.coverPhotoUrl ? (
                            <Image src={place.coverPhotoUrl} alt={place.name} width={40} height={40} className="size-full object-cover" />
                          ) : (
                            <ImageOff className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{place.name}</span>
                          <span className="text-xs text-muted-foreground">{place.region}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <PerspectiveChip perspective={place.perspective} className="hidden sm:inline-flex" />
                        <span className="text-xs text-muted-foreground">{progress.done}/{progress.total} điểm</span>
                        <span className="text-xs text-muted-foreground/70">{formatVisitedDate(place.visitedAt)}</span>
                      </div>
                    </Link>
                  );
                })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Tổng cộng {journeyStats.experiencesCount} câu chuyện và {totalPhotosArchived.toLocaleString("vi-VN")} bức ảnh đã ghi lại</span>
            <span>Đồng bộ đám mây</span>
          </div>
        </div>

        {/* 9. PASSPORT TILE */}
        <div className={`${tileBase} col-span-12 lg:col-span-4 flex min-h-[300px] flex-col justify-between`}>
          <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Travel Passport // Expedition VN</span>
              <PlaneTakeoff className="size-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="block text-base font-semibold">VN · {journeyStats.provincesVisited} PROVINCES</span>
                <span className="text-[10px] text-muted-foreground">{passportInfo.passengerLabel}</span>
              </div>
              <div className="flex size-12 shrink-0 -rotate-12 items-center justify-center rounded-full border border-dashed border-destructive/60 bg-destructive/10 p-1 text-center text-[8px] font-bold leading-none text-destructive">
                {passportInfo.sealLabel}
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-[2px] opacity-70">
                {[2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2].map((w, i) => (
                  <span key={i} className="h-6 bg-foreground" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="font-mono text-[9px] text-muted-foreground">{passportInfo.code}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Tạo tấm thẻ Boarding Pass kỷ niệm để chia sẻ trực tiếp lên Instagram Story hoặc in album ảnh cặp đôi.
            </p>
            <button
              type="button"
              onClick={() => setIsBoardingPassOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <Ticket className="size-[18px]" />
              Xuất Boarding Pass &amp; Story
            </button>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:flex-row md:px-8">
        <span>Nhật Ký Xê Dịch · Made with ♥ by {journeyStats.title}</span>
        <span className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Đồng bộ thời gian thực
        </span>
      </footer>

      <BoardingPassModal
        open={isBoardingPassOpen}
        onClose={() => setIsBoardingPassOpen(false)}
        passengerLabel={user?.displayName}
        coverPhotoUrl={latestTrip?.coverPhotoUrl}
      />
    </div>
  );
}

function LegendRow({ colorClass, label, muted }: { colorClass: string; label: string; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${muted ? "text-muted-foreground/60" : ""}`}>
      <span className={`size-2 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}

function LegendFilterRow({
  colorClass,
  label,
  checked,
  onToggle,
}: {
  colorClass: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs transition-colors hover:bg-background/60 ${checked ? "" : "text-muted-foreground/50"}`}
    >
      <span
        className={`flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border ${
          checked ? `${colorClass} border-transparent` : "border-muted-foreground/40"
        }`}
      >
        {checked && <Check className="size-2.5 text-white" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </button>
  );
}

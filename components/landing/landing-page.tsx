import Link from "next/link";
import { VietnamSilhouette } from "@/components/boarding-pass/vietnam-silhouette";
import { LandscapePassCard } from "@/components/boarding-pass/landscape-pass-card";
import { buildBoardingPassData } from "@/lib/boarding-pass-data";
import { journeyStats, foodStats, regionProgress } from "@/lib/dashboard-data";

const samplePass = buildBoardingPassData({ passengerLabel: "Tobe continue..." });

export function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="grid grid-cols-1 items-center gap-10 px-4 pt-10 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:pt-16">
        <div className="flex max-w-xl flex-col gap-6">
          <h1 className="font-heading text-4xl leading-[1.15] font-medium tracking-tight sm:text-5xl">
            Mỗi tỉnh thành hai đứa đi qua, là một trang trong cuốn nhật ký này.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Ghi lại từng chuyến đi, từng món ăn, từng khoảnh khắc — theo đúng góc nhìn của mỗi người.
            Vẽ dần tấm bản đồ của riêng hai bạn, tỉnh thành này qua tỉnh thành khác.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-primary to-entity-shared px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.45)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Bắt đầu ghi lại hành trình
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <VietnamSilhouette accentColor="#FF5A3C" className="h-[320px] w-auto sm:h-[400px]" />
          <div className="absolute bottom-0 left-1/2 w-full max-w-[280px] -translate-x-1/2 translate-y-6 rounded-2xl border border-border bg-card/90 p-3 text-center shadow-sm backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">
              Một cặp đôi đã lưu dấu <span className="font-semibold text-foreground">{journeyStats.provincesVisited}/{journeyStats.provincesTotal}</span> tỉnh thành từ năm {journeyStats.sinceYear}
            </p>
          </div>
        </div>
      </section>

      {/* ANNOTATED PRODUCT SPREAD */}
      <section className="grid grid-cols-1 gap-10 border-t border-border px-4 py-16 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col justify-center gap-8">
          <h2 className="max-w-sm font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
            Một màn hình, đủ để thấy cả hành trình của hai người.
          </h2>
          <div className="flex flex-col gap-5 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Bản đồ tô màu theo người đi</span> — mỗi tỉnh thành
              đổi màu theo ai đã đặt chân tới, để hai bạn nhìn ra ngay phần nào đã đi cùng nhau, phần nào mỗi
              người tự khám phá.
            </p>
            <p>
              <span className="font-medium text-foreground">Tiến độ theo 3 miền</span> — theo dõi hành trình
              Bắc – Trung – Nam, biết còn thiếu vùng nào để lên kế hoạch chuyến tiếp theo.
            </p>
            <p>
              <span className="font-medium text-foreground">Món ngon đã thử</span> — {foodStats.totalDishes} món
              ăn địa phương đã được ghi lại, kèm ảnh và đánh giá của riêng hai bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tiến độ theo miền</span>
          </div>
          {regionProgress.map((region) => (
            <div key={region.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>{region.name}</span>
                <span className="font-sans font-semibold tabular-nums text-muted-foreground">
                  {region.visited}/{region.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round((region.visited / region.total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE PERSPECTIVES */}
      <section className="border-t border-border bg-secondary/40 px-4 py-16 md:px-8">
        <h2 className="mb-10 max-w-md font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
          Mỗi người một góc nhìn, cùng chung một hành trình.
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <PerspectiveStat colorClass="text-entity-shared" count={8} label="Cùng nhau" description="Những chuyến đi cả hai cùng xách vali lên đường." />
          <PerspectiveStat colorClass="text-entity-partner-a" count={11} label="Bạn trai" description="Những nơi anh đã đi, kể lại cho người thương nghe." />
          <PerspectiveStat colorClass="text-entity-partner-b" count={4} label="Bạn gái" description="Những nơi em đã đi, lưu lại để lần sau rủ nhau quay lại." />
        </div>
      </section>

      {/* BOARDING PASS SHOWCASE */}
      <section className="border-t border-border px-4 py-16 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
            Mỗi chuyến đi, một tấm vé kỷ niệm.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Xuất hành trình của hai bạn thành một tấm Boarding Pass — để lưu lại, in ra, hoặc chia sẻ lên
            Instagram Story.
          </p>
          <div className="w-full max-w-xl">
            <LandscapePassCard
              data={samplePass}
              theme="noir"
              layers={{ footprintMap: true, regionStats: true, featuredBadge: false, coverPhoto: false }}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border bg-foreground px-4 py-20 text-center text-background md:px-8">
        <h2 className="mx-auto max-w-lg font-heading text-3xl leading-snug font-medium tracking-tight sm:text-4xl">
          Hành trình của hai bạn xứng đáng được ghi lại.
        </h2>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.45)] transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Tạo nhật ký miễn phí
        </Link>
      </section>
    </div>
  );
}

function PerspectiveStat({
  colorClass,
  count,
  label,
  description,
}: {
  colorClass: string;
  count: number;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
      <span className={`font-sans text-4xl font-semibold tabular-nums ${colorClass}`}>{count}</span>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

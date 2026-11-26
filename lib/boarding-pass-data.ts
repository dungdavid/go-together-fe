import { badges, coverageSplit, journeyStats, regionProgress } from "@/lib/dashboard-data";
import { BoardingPassData } from "@/components/boarding-pass/types";

const regionShortLabels: Record<string, string> = {
  "Miền Bắc": "Bắc",
  "Miền Trung & Tây Nguyên": "Trung",
  "Miền Nam & Miền Tây": "Nam",
};

export function buildBoardingPassData(options: { passengerLabel?: string; coverPhotoUrl?: string }): BoardingPassData {
  const badgesEarned = badges.filter((b) => b.earned).length;
  const currentYear = new Date().getFullYear();

  return {
    passengerLabel: options.passengerLabel ?? journeyStats.title,
    sinceYear: journeyStats.sinceYear,
    currentYear,
    provincesVisited: journeyStats.provincesVisited,
    provincesTotal: journeyStats.provincesTotal,
    destinationsCount: journeyStats.destinationsCount,
    experiencesCount: journeyStats.experiencesCount,
    badgesEarned,
    badgeRankLabel: "Soulmate Rank",
    regionPercents: regionProgress.map((r) => ({
      label: regionShortLabels[r.name] ?? r.name,
      percent: Math.round((r.visited / r.total) * 100),
    })),
    shared: coverageSplit.shared,
    partnerA: coverageSplit.partnerA,
    partnerB: coverageSplit.partnerB,
    gateCode: `VN-${journeyStats.provincesTotal}`,
    barcodeCode: `#VN-${journeyStats.provincesTotal}-${currentYear}`,
    coverPhotoUrl: options.coverPhotoUrl,
  };
}

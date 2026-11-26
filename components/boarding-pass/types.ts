export type BoardingPassFormat = "landscape" | "story";

export type BoardingPassTheme = "noir" | "sunset" | "kraft";

export interface BoardingPassLayers {
  footprintMap: boolean;
  regionStats: boolean;
  featuredBadge: boolean;
  coverPhoto: boolean;
}

export interface BoardingPassData {
  passengerLabel: string;
  sinceYear: number;
  currentYear: number;
  provincesVisited: number;
  provincesTotal: number;
  destinationsCount: number;
  experiencesCount: number;
  badgesEarned: number;
  badgeRankLabel: string;
  regionPercents: { label: string; percent: number }[];
  shared: number;
  partnerA: number;
  partnerB: number;
  gateCode: string;
  barcodeCode: string;
  coverPhotoUrl?: string;
}

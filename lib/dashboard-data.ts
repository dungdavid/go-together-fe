export interface JourneyStats {
  title: string;
  sinceYear: number;
  destinationsCount: number;
  experiencesCount: number;
  provincesVisited: number;
  provincesTotal: number;
  newThisYear: number;
}

export interface CoverageSplit {
  shared: number;
  partnerA: number;
  partnerB: number;
}

export interface RegionProgress {
  name: string;
  visited: number;
  total: number;
  planLabel?: string;
  planHref?: string;
}

export interface FoodHighlight {
  id: string;
  name: string;
  photoUrl: string;
}

export interface NextBadge {
  name: string;
  current: number;
  total: number;
  hint: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  current: number;
  total: number;
  earned: boolean;
}

export interface PassportInfo {
  code: string;
  provincesCount: number;
  passengerLabel: string;
  sealLabel: string;
}

export const journeyStats: JourneyStats = {
  title: "Tobe continue...",
  sinceYear: 2019,
  destinationsCount: 23,
  experiencesCount: 83,
  provincesVisited: 18,
  provincesTotal: 63,
  newThisYear: 2,
};

export const coverageSplit: CoverageSplit = {
  shared: 8,
  partnerA: 11,
  partnerB: 4,
};

export const regionProgress: RegionProgress[] = [
  { name: "Miền Bắc", visited: 14, total: 25 },
  { name: "Miền Trung & Tây Nguyên", visited: 4, total: 19 },
  { name: "Miền Nam & Miền Tây", visited: 0, total: 19, planLabel: "Lên lịch trình Miền Nam" },
];

export const foodHighlights: FoodHighlight[] = [
  { id: "f1", name: "Cuốn Cao Bằng", photoUrl: "https://picsum.photos/seed/caobang-cuon/200/200" },
  { id: "f2", name: "Lẩu Sa Pa", photoUrl: "https://picsum.photos/seed/sapa-lau/200/200" },
  { id: "f3", name: "Chả mực HL", photoUrl: "https://picsum.photos/seed/halong-cha-muc/200/200" },
  { id: "f4", name: "Bê Mộc Châu", photoUrl: "https://picsum.photos/seed/moc-chau-be/200/200" },
  { id: "f5", name: "Cà phê trứng", photoUrl: "https://picsum.photos/seed/ca-phe-trung/200/200" },
];

export const foodStats = {
  totalDishes: 21,
  exploreLabel: "Khám phá ẩm thực Tây Bắc",
  ratingLabel: "5/5 sao",
};

export const nextBadge: NextBadge = {
  name: "20 Tỉnh Thành Non Sông",
  current: 18,
  total: 20,
  hint: "Chỉ còn 2 tỉnh nữa để mở khoá danh hiệu Vạn Dặm!",
};

export const passportInfo: PassportInfo = {
  code: "#VN-63-2026",
  provincesCount: 18,
  passengerLabel: "PASSENGER: TOBE CONTINUE...",
  sealLabel: "SOULMATE EXPEDITION 2026",
};

export const totalPhotosArchived = 2420;

export const badges: Badge[] = [
  {
    id: "first-steps",
    name: "Bước Chân Đầu Tiên",
    description: "Lưu dấu địa điểm đầu tiên trong hành trình.",
    current: 1,
    total: 1,
    earned: true,
  },
  {
    id: "ten-provinces",
    name: "10 Tỉnh Thành",
    description: "Đặt chân đến 10 tỉnh thành khác nhau.",
    current: 10,
    total: 10,
    earned: true,
  },
  {
    id: "food-explorer",
    name: "Thực Khách Xê Dịch",
    description: "Thử 20 món ăn đặc sản địa phương.",
    current: 21,
    total: 20,
    earned: true,
  },
  {
    id: "twenty-provinces",
    name: nextBadge.name,
    description: "Đặt chân đến 20 tỉnh thành khác nhau.",
    current: nextBadge.current,
    total: nextBadge.total,
    earned: false,
  },
  {
    id: "van-dam",
    name: "Vạn Dặm",
    description: "Hoàn thành 30 tỉnh thành — cột mốc Vạn Dặm.",
    current: 18,
    total: 30,
    earned: false,
  },
  {
    id: "non-song",
    name: "Non Sông Thu Trọn",
    description: "Đặt chân đến toàn bộ 63 tỉnh thành Việt Nam.",
    current: 18,
    total: 63,
    earned: false,
  },
];

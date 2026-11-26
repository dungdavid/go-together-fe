import { Perspective } from "@/lib/types";

export type ChecklistKind = "experience" | "place" | "food";

export interface DraftChecklistItem {
  id: string;
  kind: ChecklistKind;
  label: string;
  done: boolean;
}

export interface DraftPhoto {
  id: string;
  url: string;
  isCover: boolean;
}

export interface JourneyDraft {
  province: string | null;
  placeName: string;
  perspective: Perspective;
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
  checklist: DraftChecklistItem[];
  photos: DraftPhoto[];
  story: string;
  memorableRating: number;
  privacy: "public" | "private";
}

export type DraftPatch = Partial<JourneyDraft> | ((prev: JourneyDraft) => Partial<JourneyDraft>);

export const emptyDraft: JourneyDraft = {
  province: null,
  placeName: "",
  perspective: "shared",
  startDate: "",
  endDate: "",
  lat: 16.0471,
  lng: 108.2062,
  checklist: [],
  photos: [],
  story: "",
  memorableRating: 0,
  privacy: "private",
};

export const suggestionsByProvince: Record<string, string[]> = {
  "Sơn La": ["Săn mây Tà Xùa", "Sống lưng khủng long", "Đồi chè Mộc Châu", "Cá hồi Sa Pa"],
  "Lào Cai (Sa Pa)": ["Trek ruộng bậc thang", "Đón bình minh Fansipan", "Ghé bản người H'Mông", "Thử thắng cố"],
  "Lâm Đồng": ["Đồi chè Cầu Đất", "Thác Datanla", "Cà phê view đồi thông", "Chợ đêm Đà Lạt"],
  "Quảng Ninh": ["Du thuyền vịnh Hạ Long", "Chèo kayak", "Hang Sửng Sốt", "Chả mực Hạ Long"],
  "Quảng Nam": ["Dạo phố cổ về đêm", "Thả đèn hoa đăng", "May áo dài", "Cao lầu Hội An"],
  "Kiên Giang": ["Lặn ngắm san hô", "Chợ đêm Phú Quốc", "Cáp treo Hòn Thơm", "Gỏi cá trích"],
};

export const defaultSuggestions = [
  "Tham quan điểm nổi bật",
  "Thử đặc sản địa phương",
  "Check-in sống ảo",
  "Trải nghiệm văn hoá địa phương",
];

export function checklistKindMeta(kind: ChecklistKind) {
  switch (kind) {
    case "experience":
      return { label: "Trải nghiệm", textClass: "text-entity-shared", bgClass: "bg-entity-shared/15" };
    case "place":
      return { label: "Địa điểm", textClass: "text-entity-partner-a", bgClass: "bg-entity-partner-a/15" };
    case "food":
      return { label: "Món ăn", textClass: "text-primary", bgClass: "bg-primary/15" };
  }
}

export function checklistProgress(items: DraftChecklistItem[]): { done: number; total: number; percent: number } {
  const total = items.length;
  const done = items.filter((item) => item.done).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

let idCounter = 0;
export function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

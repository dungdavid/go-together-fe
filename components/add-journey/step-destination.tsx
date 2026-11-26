"use client";

import { Sparkles, MapPin, CalendarDays } from "lucide-react";
import { DraftPatch, JourneyDraft } from "@/components/add-journey/journey-draft";
import { ProvinceCombobox } from "@/components/add-journey/province-combobox";
import { PerspectivePicker } from "@/components/add-journey/perspective-picker";
import { provinceSubRegion, provinces, regionLabels } from "@/lib/vietnam-provinces";

export function StepDestination({
  draft,
  onChange,
  visitedNames,
}: {
  draft: JourneyDraft;
  onChange: (patch: DraftPatch) => void;
  visitedNames: Set<string>;
}) {
  const subRegion = draft.province ? provinceSubRegion[draft.province] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm font-medium">
          Tỉnh thành <span className="font-bold text-primary">*</span>
        </label>
        <ProvinceCombobox
          value={draft.province}
          onChange={(province) => onChange({ province })}
          visitedNames={visitedNames}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-sm font-medium">
            Tên địa điểm &amp; Kỷ niệm <span className="font-bold text-primary">*</span>
          </label>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Tên sẽ hiển thị trên bản đồ &amp; thẻ hành trình
          </span>
        </div>
        <input
          value={draft.placeName}
          onChange={(e) => onChange({ placeName: e.target.value })}
          placeholder="VD: Đà Lạt mộng mơ, Tà Xùa đón gió..."
          className="w-full rounded-xl bg-muted px-4 py-2.5 text-sm outline-none ring-primary/40 transition-colors focus:bg-secondary focus:ring-2"
        />
        <p className="text-xs text-muted-foreground sm:hidden">
          Tên hiển thị nổi bật trên bản đồ lưu niệm và hành trình chung.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Vùng miền</label>
        <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-[18px] text-primary" />
            <span className="text-sm font-medium">
              {draft.province ? `${regionLabelFor(draft.province)}${subRegion ? ` · ${subRegion}` : ""}` : "Chọn tỉnh thành trước"}
            </span>
          </div>
          <span className="hidden text-xs tracking-tight text-muted-foreground sm:inline">
            (Tự động nhận diện theo tỉnh)
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-sm font-medium">
            Ai đã đi? <span className="font-bold text-primary">*</span>
          </label>
          <span className="text-xs text-muted-foreground">Chọn 1 góc nhìn</span>
        </div>
        <PerspectivePicker value={draft.perspective} onChange={(perspective) => onChange({ perspective })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Thời gian chuyến đi</label>
          <span className="hidden text-xs text-muted-foreground sm:inline">Dùng để xếp dòng thời gian lũy kế</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3.5 py-2.5">
            <CalendarDays className="size-[18px] shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Khởi hành</span>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3.5 py-2.5">
            <CalendarDays className="size-[18px] shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Kết thúc</span>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Định vị toạ độ trên bản đồ</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3.5 py-2.5">
            <MapPin className="size-[18px] shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Vĩ độ (lat)</span>
              <input
                type="number"
                step="0.0001"
                value={draft.lat}
                onChange={(e) => onChange({ lat: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3.5 py-2.5">
            <MapPin className="size-[18px] shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Kinh độ (lng)</span>
              <input
                type="number"
                step="0.0001"
                value={draft.lng}
                onChange={(e) => onChange({ lng: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Tìm toạ độ trên Google Maps (nhấn giữ 1 điểm) rồi dán vào đây.
        </p>
      </div>
    </div>
  );
}

function regionLabelFor(provinceName: string): string {
  const province = provinces.find((p) => p.name === provinceName);
  return province ? regionLabels[province.region] : "";
}

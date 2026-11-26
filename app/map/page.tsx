"use client";

import { PageHeader } from "@/components/layout/page-header";
import PlaceMap from "@/components/map/place-map-loader";
import { usePlaces } from "@/lib/api";

export default function MapPage() {
  const { data: places } = usePlaces();

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] flex-col md:h-screen">
      <PageHeader title="Bản đồ" description="Toàn bộ địa điểm hai bạn đã lưu và ghim lại." />
      <div className="relative flex-1">
        <PlaceMap places={places ?? []} />
      </div>
    </div>
  );
}

import { Perspective, Place } from "@/lib/types";

/**
 * Maps a place id to the exact "Name" property used in
 * public/geo/vn-provinces.geojson, since that dataset has no diacritics
 * and our Place.region is a free-text display string that doesn't match it.
 */
export const placeProvince: Record<string, string> = {
  "sa-pa": "Lao Cai",
  "ta-xua": "Son La",
  "hoi-an": "Quang Nam",
  "ha-long-bay": "Quang Ninh",
  "da-lat": "Lam Dong",
  "phu-quoc": "Kien Giang",
};

const perspectivePriority: Perspective[] = ["shared", "partnerA", "partnerB"];

/**
 * A province that has places under more than one distinct perspective is
 * treated as "shared" — simplification for a single fill color per region.
 */
export function provincePerspective(provinceName: string, places: Place[]): Perspective | null {
  const perspectives = new Set(
    places
      .filter((place) => placeProvince[place.id] === provinceName)
      .map((place) => place.perspective),
  );

  if (perspectives.size === 0) return null;
  if (perspectives.size > 1) return "shared";
  return perspectivePriority.find((p) => perspectives.has(p)) ?? null;
}

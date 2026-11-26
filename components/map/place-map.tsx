"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTheme } from "next-themes";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Place } from "@/lib/types";
import { formatVisitedDate } from "@/lib/format";
import { perspectiveMapColors, perspectiveMarkerIcon } from "@/lib/perspective-colors";
import { perspectiveConfig } from "@/components/dashboard/perspective-chip";

interface PlaceMapProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function PlaceMap({
  places,
  center = [16.0, 107.5],
  zoom = 5.3,
  className,
}: PlaceMapProps) {
  const { resolvedTheme } = useTheme();
  const palette = perspectiveMapColors[resolvedTheme === "light" ? "light" : "dark"];
  const bounds = places.length > 0 ? L.latLngBounds(places.map((p): [number, number] => [p.lat, p.lng])) : undefined;

  return (
    <div className={className ? `relative ${className}` : "relative h-full w-full"}>
      <MapContainer
        {...(bounds
          ? { bounds, boundsOptions: { padding: [48, 48] as [number, number] } }
          : { center, zoom })}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]} icon={perspectiveMarkerIcon(palette[place.perspective])}>
            <Popup>
              <div className="flex flex-col gap-1 min-w-[160px]">
                <span className="font-semibold text-sm">{place.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatVisitedDate(place.visitedAt)}
                </span>
                <a
                  href={`/places/${place.id}`}
                  className="mt-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                >
                  Xem chi tiết
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-1.5 rounded-2xl bg-card/95 p-3 text-xs shadow-md backdrop-blur-sm">
        {(["shared", "partnerA", "partnerB"] as const).map((perspective) => {
          const { label } = perspectiveConfig(perspective);
          return (
            <div key={perspective} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: palette[perspective] }} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

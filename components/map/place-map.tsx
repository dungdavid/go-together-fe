"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Place } from "@/lib/types";
import { formatVisitedDate } from "@/lib/format";

const pinIcon = L.divIcon({
  className: "",
  html: `<span class="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background text-xs font-semibold shadow-sm">•</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

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
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className ?? "h-full w-full"}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={pinIcon}>
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
                View details
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

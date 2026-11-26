"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import L, { type Layer, type PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import { Place, Perspective } from "@/lib/types";
import { provincePerspective } from "@/lib/province-map";

const REGION_FILL_MIN_ZOOM = 6;

const colors: Record<"light" | "dark", Record<Perspective | "unvisited", string>> = {
  light: { shared: "#E11D48", partnerA: "#0284C7", partnerB: "#7C3AED", unvisited: "#A1A1AA" },
  dark: { shared: "#FB7185", partnerA: "#38BDF8", partnerB: "#A78BFA", unvisited: "#71717A" },
};

function markerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};box-shadow:0 0 0 3px rgba(0,0,0,0.25), 0 0 8px ${color};"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvent("zoomend", (e) => onZoom(e.target.getZoom()));
  return null;
}

interface JourneyMapProps {
  places: Place[];
  className?: string;
}

export default function JourneyMap({ places, className }: JourneyMapProps) {
  const { resolvedTheme } = useTheme();
  const [zoom, setZoom] = useState(5);
  const [provinces, setProvinces] = useState<GeoJSON.FeatureCollection | null>(null);

  const palette = colors[resolvedTheme === "light" ? "light" : "dark"];
  const showRegionFill = zoom >= REGION_FILL_MIN_ZOOM;

  useEffect(() => {
    fetch("/geo/vn-provinces.geojson")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(() => setProvinces(null));
  }, []);

  function styleProvince(feature?: Feature<Geometry, { Name?: string }>): PathOptions {
    const name = feature?.properties?.Name;
    const perspective = name ? provincePerspective(name, places) : null;
    const fillColor = perspective ? palette[perspective] : palette.unvisited;

    return {
      color: resolvedTheme === "light" ? "#FFFFFF" : "#000000",
      weight: 0.6,
      opacity: showRegionFill ? 0.5 : 0,
      fillColor,
      fillOpacity: showRegionFill ? (perspective ? 0.55 : 0.12) : 0,
    };
  }

  function onEachProvince(feature: Feature<Geometry, { Name?: string }>, layer: Layer) {
    if (feature.properties?.Name) {
      layer.bindTooltip(feature.properties.Name, { sticky: true });
    }
  }

  return (
    <MapContainer
      center={[16.5, 107.5]}
      zoom={zoom}
      minZoom={2}
      maxZoom={10}
      worldCopyJump
      scrollWheelZoom
      zoomAnimation={false}
      className={className ?? "h-full w-full"}
    >
      <ZoomWatcher onZoom={setZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com">Esri</a>'
        url={
          resolvedTheme === "light"
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        }
      />

      {provinces && (
        <GeoJSON
          key={`${zoom}-${resolvedTheme}-${places.length}`}
          data={provinces}
          style={styleProvince}
          onEachFeature={onEachProvince}
        />
      )}

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={markerIcon(palette[place.perspective])}
        >
          <Popup>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <span className="font-semibold text-sm">{place.name}</span>
              <span className="text-xs text-muted-foreground">{place.region}</span>
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
  );
}

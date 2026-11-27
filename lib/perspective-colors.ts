import L from "leaflet";
import { Perspective } from "@/lib/types";

export const perspectiveMapColors: Record<"light" | "dark", Record<Perspective | "unvisited", string>> = {
  light: { shared: "#BE123C", partnerA: "#0369A1", partnerB: "#7C3AED", unvisited: "#A1A1AA" },
  dark: { shared: "#FB7185", partnerA: "#38BDF8", partnerB: "#A78BFA", unvisited: "#71717A" },
};

export function perspectiveMarkerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};box-shadow:0 0 0 3px rgba(0,0,0,0.25), 0 0 8px ${color};"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

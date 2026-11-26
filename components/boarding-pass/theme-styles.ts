import { BoardingPassTheme } from "@/components/boarding-pass/types";

export interface ThemeStyle {
  label: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
  swatchClassName: string;
}

export const themeStyles: Record<BoardingPassTheme, ThemeStyle> = {
  noir: {
    label: "Noir",
    cardBackground: "linear-gradient(135deg, #18181f 0%, #151519 55%, #121215 100%)",
    textColor: "#ffffff",
    mutedTextColor: "#a1a1aa",
    accentColor: "#FF5A3C",
    borderColor: "rgba(255,255,255,0.12)",
    swatchClassName: "bg-[#121215] border-2 border-[#FF5A3C]",
  },
  sunset: {
    label: "Hoàng hôn",
    cardBackground: "linear-gradient(135deg, #FF5A3C 0%, #FB7185 100%)",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255,255,255,0.75)",
    accentColor: "#ffffff",
    borderColor: "rgba(255,255,255,0.3)",
    swatchClassName: "bg-gradient-to-tr from-[#FF5A3C] to-[#FB7185] border border-white/20",
  },
  kraft: {
    label: "Giấy cũ",
    cardBackground: "linear-gradient(135deg, #E8DCC4 0%, #DCCBA3 100%)",
    textColor: "#3a2f22",
    mutedTextColor: "#6b5d47",
    accentColor: "#9c4a2b",
    borderColor: "rgba(58,47,34,0.2)",
    swatchClassName: "bg-[#E8DCC4] border border-stone-400",
  },
};

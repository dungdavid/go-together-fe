"use client";

import { useEffect, useState } from "react";

export type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy";

export interface LiveDayForecast {
  label: string;
  condition: WeatherCondition;
  tempC: number;
  isHighlighted?: boolean;
}

export interface LiveWeather {
  locationLabel: string;
  tempC: number;
  conditionLabel: string;
  days: LiveDayForecast[];
}

type Status = "locating" | "loading" | "ready" | "denied" | "error";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const WMO_LABELS: Record<number, string> = {
  0: "Trời quang",
  1: "Quang, ít mây",
  2: "Có mây",
  3: "Nhiều mây",
  45: "Sương mù",
  48: "Sương mù",
  51: "Mưa phùn nhẹ",
  53: "Mưa phùn",
  55: "Mưa phùn nặng hạt",
  56: "Mưa phùn đông lạnh",
  57: "Mưa phùn đông lạnh",
  61: "Mưa nhỏ",
  63: "Mưa",
  65: "Mưa to",
  66: "Mưa đông lạnh",
  67: "Mưa đông lạnh nặng",
  71: "Tuyết nhẹ",
  73: "Tuyết",
  75: "Tuyết dày",
  77: "Hạt tuyết",
  80: "Mưa rào nhẹ",
  81: "Mưa rào",
  82: "Mưa rào mạnh",
  85: "Mưa tuyết rào",
  86: "Mưa tuyết rào mạnh",
  95: "Dông",
  96: "Dông kèm mưa đá",
  99: "Dông kèm mưa đá lớn",
};

function conditionFromCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2) return "partly-cloudy";
  if (code === 3 || code === 45 || code === 48) return "cloudy";
  return "rainy";
}

export function useLiveWeather(enabled: boolean): { status: Status; weather: LiveWeather | null; retry: () => void } {
  const [status, setStatus] = useState<Status>("locating");
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    if (!("geolocation" in navigator)) {
      Promise.resolve().then(() => setStatus("error"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus("loading");
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,weather_code&timezone=auto&forecast_days=5`,
            ),
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`,
            ).catch(() => null),
          ]);

          if (!weatherRes.ok) throw new Error("weather request failed");
          const weatherData = await weatherRes.json();
          const geoData = geoRes && geoRes.ok ? await geoRes.json() : null;

          const locationLabel = geoData
            ? [geoData.city || geoData.locality, geoData.principalSubdivision].filter(Boolean).join(", ")
            : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

          const days: LiveDayForecast[] = weatherData.daily.time.map((dateStr: string, index: number) => ({
            label: WEEKDAY_LABELS[new Date(dateStr).getDay()],
            condition: conditionFromCode(weatherData.daily.weather_code[index]),
            tempC: Math.round(weatherData.daily.temperature_2m_max[index]),
            isHighlighted: index === 0,
          }));

          setWeather({
            locationLabel: locationLabel || "Vị trí hiện tại",
            tempC: Math.round(weatherData.current.temperature_2m),
            conditionLabel: WMO_LABELS[weatherData.current.weather_code] ?? "Đang cập nhật",
            days,
          });
          setStatus("ready");
        } catch {
          setStatus("error");
        }
      },
      (geoError) => {
        setStatus(geoError.code === geoError.PERMISSION_DENIED ? "denied" : "error");
      },
      { timeout: 10000 },
    );
  }, [attempt, enabled]);

  function retry() {
    setStatus("locating");
    setAttempt((a) => a + 1);
  }

  return { status, weather, retry };
}

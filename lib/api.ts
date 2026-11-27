import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Perspective, Place } from "@/lib/types";
import { JourneyDraft } from "@/components/add-journey/journey-draft";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export function usePlaces() {
  return useQuery({
    queryKey: ["places"],
    queryFn: () => fetchJson<Place[]>("/places"),
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ["places", id],
    queryFn: () => fetchJson<Place>(`/places/${id}`),
    enabled: Boolean(id),
  });
}

interface CreatedJourneyResult {
  place: Place;
  checklistCreatedCount: number;
  foodCreatedCount: number;
}

async function submitJourney(draft: JourneyDraft): Promise<CreatedJourneyResult> {
  const uploadedPhotos = await Promise.all(
    draft.photos.map(async (photo) => ({
      url: await uploadImageToCloudinary(photo.file),
      isCover: photo.isCover,
    })),
  );

  const place = await fetchJson<Place>("/places", {
    method: "POST",
    body: JSON.stringify({
      name: draft.placeName,
      lat: draft.lat,
      lng: draft.lng,
      region: draft.province ?? undefined,
      visitedAt: draft.startDate || undefined,
      perspective: draft.perspective satisfies Perspective,
      notes: draft.story || undefined,
      coverPhotoUrl: uploadedPhotos.find((p) => p.isCover)?.url ?? uploadedPhotos[0]?.url,
    }),
  });

  let checklistCreatedCount = 0;
  let foodCreatedCount = 0;

  for (const item of draft.checklist) {
    if (!item.label.trim()) continue;

    if (item.kind === "food") {
      await fetchJson(`/places/${place.id}/food-items`, {
        method: "POST",
        body: JSON.stringify({ name: item.label }),
      });
      foodCreatedCount += 1;
      continue;
    }

    const created = await fetchJson<{ id: string }>(`/places/${place.id}/checklist-items`, {
      method: "POST",
      body: JSON.stringify({ label: item.label }),
    });
    checklistCreatedCount += 1;

    if (item.done) {
      await fetchJson(`/checklist-items/${created.id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: true }),
      });
    }
  }

  for (const photo of uploadedPhotos) {
    await fetchJson(`/places/${place.id}/photos`, {
      method: "POST",
      body: JSON.stringify({ url: photo.url }),
    });
  }

  return { place, checklistCreatedCount, foodCreatedCount };
}

export function useCreateJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

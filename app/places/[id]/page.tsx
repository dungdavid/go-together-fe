"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checklist } from "@/components/places/checklist";
import { FoodList } from "@/components/places/food-list";
import PlaceMap from "@/components/map/place-map-loader";
import { usePlace } from "@/lib/api";
import { formatVisitedDate, checklistProgress } from "@/lib/format";

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: place, isLoading } = usePlace(id);

  if (isLoading || !place) {
    return (
      <div className="px-4 py-6 md:px-8">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  const { done, total } = checklistProgress(place);

  return (
    <div className="pb-24 md:pb-10">
      <div className="relative aspect-[16/9] w-full bg-muted sm:aspect-[21/9]">
        {place.coverPhotoUrl && (
          <Image
            src={place.coverPhotoUrl}
            alt={place.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
        <Link
          href="/places"
          className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
            {place.name}
          </h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-white/85">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {place.region}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatVisitedDate(place.visitedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        {place.notes && (
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{place.notes}</p>
        )}

        <Tabs defaultValue="checklist">
          <TabsList>
            <TabsTrigger value="checklist">
              Checklist {total > 0 && `(${done}/${total})`}
            </TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card className="p-3">
              <Checklist items={place.checklist} />
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card className="p-4">
              <FoodList items={place.foodList} />
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="h-72 overflow-hidden p-0">
              <PlaceMap places={[place]} center={[place.lat, place.lng]} zoom={11} />
            </Card>
          </TabsContent>
        </Tabs>

        {place.photos.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Photos
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {place.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? place.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 240px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

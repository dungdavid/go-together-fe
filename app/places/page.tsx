"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { PlaceCard } from "@/components/places/place-card";
import { usePlaces } from "@/lib/api";

export default function PlacesPage() {
  const { data: places, isLoading } = usePlaces();

  return (
    <div className="pb-24 md:pb-10">
      <PageHeader
        title="Saved Places"
        description={`${places?.length ?? 0} places you've logged so far.`}
        action={
          <Link href="/add" className={buttonVariants({ className: "hidden sm:inline-flex" })}>
            <Plus className="size-4" />
            Add place
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))
          : places?.map((place) => <PlaceCard key={place.id} place={place} />)}
      </section>
    </div>
  );
}

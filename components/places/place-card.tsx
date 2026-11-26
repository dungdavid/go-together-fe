import Link from "next/link";
import Image from "next/image";
import { ImageOff, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Place } from "@/lib/types";
import { checklistProgress, formatVisitedDate } from "@/lib/format";

export function PlaceCard({ place }: { place: Place }) {
  const { done, total } = checklistProgress(place);

  return (
    <Link href={`/places/${place.id}`} className="block max-w-sm">
      <Card className="overflow-hidden transition-colors hover:border-primary/40 p-0">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {place.coverPhotoUrl ? (
            <Image
              src={place.coverPhotoUrl}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageOff className="size-8" />
              <span className="text-xs">Chưa có ảnh bìa</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {place.region}
          </div>
          <h3 className="font-semibold leading-snug">{place.name}</h3>
          <p className="text-xs text-muted-foreground">
            Đã ghé {formatVisitedDate(place.visitedAt)}
          </p>
          {total > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <Progress value={(done / total) * 100} className="h-1.5" />
              <span className="text-xs text-muted-foreground shrink-0">
                {done}/{total}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

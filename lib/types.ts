export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  notes?: string;
  rating?: number;
  photoUrl?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export type Perspective = "shared" | "partnerA" | "partnerB";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region?: string;
  visitedAt?: string;
  coverPhotoUrl?: string;
  notes?: string;
  perspective: Perspective;
  checklist: ChecklistItem[];
  foodList: FoodItem[];
  photos: Photo[];
}

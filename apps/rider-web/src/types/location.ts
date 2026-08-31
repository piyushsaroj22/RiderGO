export interface LocationSelection {
  address: string;
  latitude: number;
  longitude: number;
}

export type MapSelectionMode = "pickup" | "destination" | null;

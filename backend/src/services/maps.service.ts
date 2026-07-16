export interface Location {
  latitude: number;
  longitude: number;
}

export interface RouteDetails {
  distance: number; // kilometers
  duration: number; // minutes
}

export const getRouteDetails = async (
  pickup: Location,
  destination: Location,
): Promise<RouteDetails> => {
  // TODO
  // Google Maps Routes API

  return {
    distance: 0,
    duration: 0,
  };
};

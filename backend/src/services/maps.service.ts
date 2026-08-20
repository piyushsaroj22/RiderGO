import env from "../config/env.js";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RouteDetails {
  distance: number; // kilometers
  duration: number; // minutes
}

interface GoogleRoutesResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
}

const GOOGLE_ROUTES_API_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

export const getRouteDetails = async (
  pickup: Location,
  destination: Location,
): Promise<RouteDetails> => {
  const response = await fetch(GOOGLE_ROUTES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": env.GOOGLE_DEMO_MAPS_API_KEY,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin: {
        location: {
          latLng: {
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          },
        },
      },

      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        },
      },

      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Google Routes API error:", {
      status: response.status,
      body: errorBody,
    });

    throw new Error("Failed to calculate route.");
  }

  const data = (await response.json()) as GoogleRoutesResponse;

  const route = data.routes?.[0];

  if (!route?.distanceMeters || !route.duration) {
    throw new Error("No route found.");
  }

  const durationSeconds = Number.parseFloat(route.duration.replace("s", ""));

  if (!Number.isFinite(durationSeconds)) {
    throw new Error("Invalid route duration received.");
  }

  return {
    distance: route.distanceMeters / 1000,
    duration: durationSeconds / 60,
  };
};

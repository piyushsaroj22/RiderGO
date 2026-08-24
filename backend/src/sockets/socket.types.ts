export type AccountType = "User" | "Driver";

export interface ConnectedAccount {
  accountId: string;
  accountType: AccountType;
  socketId: string;
}

export interface DriverLocationPayload {
  latitude: number;
  longitude: number;
}

export interface DriverLocationEvent {
  driverId: string;
  latitude: number;
  longitude: number;
}

export interface RideOfferPayload {
  rideId: string;
  riderId: string;

  pickup: {
    address: string;
    latitude: number;
    longitude: number;
  };

  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };

  vehicleType: "Bike" | "Auto" | "Car";

  fare: number;
  distance: number;
  duration: number;
}

export interface RideAcceptedPayload {
  rideId: string;

  driver: {
    id: string;
    name: string;
    phone: string;
    profileImage: string;
    vehicleType: "Bike" | "Auto" | "Car";
  };
}

export interface RideDriverArrivedPayload {
  rideId: string;
}

export interface RideOtpVerifiedPayload {
  rideId: string;
}

export interface RideStartedPayload {
  rideId: string;
}

export interface RideCompletedPayload {
  rideId: string;
}

export interface RideCancelledPayload {
  rideId: string;
  cancelledBy: "User" | "Driver" | "Admin";
}

export interface DriverLocationPayload {
  driverId: string;
  latitude: number;
  longitude: number;
}

// export type SocketAccountType = "User" | "Driver";

export interface DriverDisconnectedPayload {
  rideId: string;
}

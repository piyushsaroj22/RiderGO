export type VehicleType = "Bike" | "Auto" | "Car";

export type PaymentMethod = "Cash" | "UPI" | "Card";

export type RideStatus =
  | "SEARCHING"
  | "NO_DRIVER_FOUND"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ARRIVED"
  | "OTP_VERIFIED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface CreateRideInput {
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

  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
}

export interface CreateRideResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    rider: string;
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
    vehicleType: VehicleType;
    fare: number;
    distance: number;
    duration: number;
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    status: string;
  };
}

export interface GetDriverRideResponse {
  success: boolean;
  data: {
    id: string;
    rider: string;
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
    vehicleType: VehicleType;
    fare: number;
    distance: number;
    duration: number;
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    status: string;
  };
}

export interface DriverArrivedResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface VerifyRideOtpInput {
  otp: string;
}

export interface VerifyRideOtpResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface AcceptRideResponse {
  success: boolean;
  message: string;
}

export interface RejectRideResponse {
  success: boolean;
  message: string;
}

export interface StartRideResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface CompleteRideResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
    paymentStatus: string;
  };
}

export interface CancelRideInput {
  reason: string;
}

export interface CancelRideResponse {
  success: boolean;
  message: string;
}

export interface CancelRideByDriverResponse {
  success: boolean;
  message: string;
}

export interface RideHistoryItem {
  id: string;
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
  vehicleType: VehicleType;
  fare: number;
  distance: number;
  duration: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  status: RideStatus;
  createdAt: Date;
}

export interface RideHistoryResponse {
  success: boolean;
  data: RideHistoryItem[];
}

export interface RideDetailsResponse {
  success: boolean;
  data: {
    id: string;
    rider: string;
    driver: string | null;

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

    vehicleType: VehicleType;
    fare: number;
    distance: number;
    duration: number;
    paymentMethod: PaymentMethod;
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    status: RideStatus;
    cancellationFee: number;
    cancellationReason: string;
    cancelledBy: "User" | "Driver" | "Admin" | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

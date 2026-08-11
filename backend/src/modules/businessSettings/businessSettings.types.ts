export interface VehiclePricing {
  baseFare: number;
  perKm: number;
  perMinute: number;
}

export interface BusinessSettings {
  pricing: {
    bike: VehiclePricing;
    auto: VehiclePricing;
    car: VehiclePricing;
  };

  cancellation: {
    userFee: number;
    driverPenalty: number;
    freeCancellationBeforeDriverAccepts: boolean;
  };

  driverMatching: {
    searchRadius: number;
  };

  peakHour: {
    enabled: boolean;
    multiplier: number;
  };

  trafficPricing: {
    enabled: boolean;
    multiplier: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateBusinessSettingsInput {
  pricing?: {
    bike?: Partial<VehiclePricing>;
    auto?: Partial<VehiclePricing>;
    car?: Partial<VehiclePricing>;
  };

  cancellation?: {
    userFee?: number;
    driverPenalty?: number;
    freeCancellationBeforeDriverAccepts?: boolean;
  };

  driverMatching?: {
    searchRadius?: number;
  };

  peakHour?: {
    enabled?: boolean;
    multiplier?: number;
  };

  trafficPricing?: {
    enabled?: boolean;
    multiplier?: number;
  };
}

export interface GetBusinessSettingsResponse {
  success: boolean;
  data: BusinessSettings;
}

export interface UpdateBusinessSettingsResponse {
  success: boolean;
  message: string;
  data: BusinessSettings;
}

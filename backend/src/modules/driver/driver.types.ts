export interface RegisterDriverInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleType: "Bike" | "Auto" | "Car";
}

export interface RegisterDriverResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
  };
}

export interface LoginDriverInput {
  email: string;
  password: string;
}

export interface LoginDriverResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    profileImage: string;
    isEmailVerified: boolean;
    isApproved: boolean;
    isOnline: boolean;
  };
}

export interface GetCurrentDriverResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    profileImage: string;
    isEmailVerified: boolean;
    isApproved: boolean;
    isOnline: boolean;
  };
}

export interface GetDriverProfileResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    profileImage: string;
    isEmailVerified: boolean;
    isApproved: boolean;
    isOnline: boolean;
  };
}

export interface UpdateDriverProfileInput {
  name: string;
  phone: string;
}

export interface UpdateDriverProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    profileImage: string;
    isEmailVerified: boolean;
    isApproved: boolean;
    isOnline: boolean;
  };
}

export interface UpdateDriverImageResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    profileImage: string;
    licenseImage: string;
    rcImage: string;
    vehicleImage: string;
    isEmailVerified: boolean;
    isApproved: boolean;
    isOnline: boolean;
  };
}

export interface UpdateDriverLocationInput {
  latitude: number;
  longitude: number;
}

export interface UpdateDriverLocationResponse {
  success: boolean;
  message: string;
}

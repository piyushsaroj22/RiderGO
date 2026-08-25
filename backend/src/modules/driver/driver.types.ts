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
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isOnline: boolean;
    isBlocked: boolean;
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
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isOnline: boolean;
    isBlocked: boolean;
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
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isOnline: boolean;
    isBlocked: boolean;
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
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isOnline: boolean;
    isBlocked: boolean;
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
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isOnline: boolean;
    isBlocked: boolean;
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

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordInput {
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

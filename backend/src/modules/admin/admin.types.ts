export interface RegisterAdminInput {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterAdminResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
  };
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    isActive: boolean;
  };
}

export interface GetCurrentAdminResponse {
  success: boolean;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    isActive: boolean;
    lastLogin: Date | null;
  };
}

export interface GetAdminProfileResponse {
  success: boolean;
  data: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
    role: "SUPER_ADMIN" | "ADMIN";
    isActive: boolean;
    lastLogin: Date | null;
  };
}

export type DriverVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface GetPendingDriversResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: "Bike" | "Auto" | "Car";
    verificationStatus: DriverVerificationStatus;
    createdAt: Date;
  }[];
}

export interface GetDriverDetailsResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: "Bike" | "Auto" | "Car";

    profileImage: string;
    licenseImage: string;
    rcImage: string;
    vehicleImage: string;

    isEmailVerified: boolean;
    verificationStatus: DriverVerificationStatus;
    rejectionReason: string;
    approvedAt: Date | null;

    createdAt: Date;
  };
}

export interface UpdateDriverVerificationInput {
  status: DriverVerificationStatus;
  rejectionReason?: string;
}

export interface UpdateDriverVerificationResponse {
  success: boolean;
  message: string;
}

export interface LogoutAdminResponse {
  success: boolean;
  message: string;
}

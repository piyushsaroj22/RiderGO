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

export interface DriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: "Bike" | "Auto" | "Car";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  isBlocked: boolean;
  isOnline: boolean;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface BlockDriverInput {
  reason: string;
}

export interface BlockDriverResponse {
  success: boolean;
  message: string;
}

export interface UnblockDriverResponse {
  success: boolean;
  message: string;
}

export interface GetDriversQuery {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  isBlocked?: boolean;
  vehicleType?: "Bike" | "Auto" | "Car";
  sortBy?: "createdAt" | "averageRating" | "totalRatings";
  sortOrder?: "asc" | "desc";
}

export interface GetUsersQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  isBlocked?: "true" | "false";
  sortBy?: "name" | "email" | "createdAt" | "averageRating" | "totalRatings";
  sortOrder?: "asc" | "desc";
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  isBlocked?: boolean;
  sortBy?: "name" | "email" | "createdAt" | "averageRating" | "totalRatings";
  sortOrder?: "asc" | "desc";
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: {
      id: string;
      name: string;
      email: string;
      profileImage: string;
      averageRating: number;
      totalRatings: number;
      isBlocked: boolean;
      createdAt: Date;
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface BlockUserInput {
  reason: string;
}

export interface UpdateUserBlockStatusResponse {
  success: boolean;
  message: string;
}

export interface DriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: "Bike" | "Auto" | "Car";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  isBlocked: boolean;
  isOnline: boolean;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetDriversResponse {
  success: boolean;
  data: {
    drivers: DriverListItem[];
    pagination: Pagination;
  };
}

export interface DriverFilter {
  $or?: {
    name?: {
      $regex: string;
      $options: string;
    };

    email?: {
      $regex: string;
      $options: string;
    };

    phone?: {
      $regex: string;
      $options: string;
    };
  }[];
  verificationStatus?: DriverVerificationStatus;
  isBlocked?: boolean;
  vehicleType?: "Bike" | "Auto" | "Car";
}

export interface GetDriversQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  verificationStatus?: DriverVerificationStatus;
  isBlocked?: "true" | "false";
  vehicleType?: "Bike" | "Auto" | "Car";
  sortBy?: "createdAt" | "averageRating" | "totalRatings";
  sortOrder?: "asc" | "desc";
}

export interface BlockDriverInput {
  reason: string;
}

export interface UnblockDriverInput {}

export interface UpdateDriverBlockStatusResponse {
  success: boolean;
  message: string;
}

export interface CreateAppealInput {
  reason: string;
}

export interface CreateAppealResponse {
  success: boolean;
  message: string;
}

export interface GetDriverAppealsResponse {
  success: boolean;
  data: {
    appeals: {
      id: string;
      reason: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      adminResponse: string;
      createdAt: Date;
      resolvedAt: Date | null;
    }[];
  };
}

export interface GetAdminAppealsQuery {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAdminAppealsQueryParams {
  page?: string;
  limit?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAdminAppealsResponse {
  success: boolean;
  data: {
    appeals: {
      id: string;
      driver: {
        id: string;
        name: string;
        email: string;
        phone: string;
      };
      reason: string;
      originalBlockReason: string;
      blockedAtSnapshot: Date | null;
      status: "PENDING" | "APPROVED" | "REJECTED";
      adminResponse: string;
      createdAt: Date;
      resolvedAt: Date | null;
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ReviewAppealInput {
  status: "APPROVED" | "REJECTED";
  response: string;
}

export interface ReviewAppealResponse {
  success: boolean;
  message: string;
}

export interface ReviewAppealParams {
  appealId: string;
}

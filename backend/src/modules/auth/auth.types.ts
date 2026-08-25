export interface VerifyUserEmailResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUserData;
}

export interface GetCurrentUserResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    isEmailVerified: boolean;
  };
}

export interface LogoutUserResponse {
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

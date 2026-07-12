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

import api from "./axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterInput) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginInput) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
  resetPassword: async (token: string, data: { password: string }) => {
    const response = await api.post(`/auth/reset-password/${token}`, data);
    return response.data;
  },
  forgotPassword: async (data: { email: string }) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },
};

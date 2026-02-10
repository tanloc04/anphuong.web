import type { ApiErrorDetail } from "./common.types"

export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string,
  refreshToken: string
}

export interface LoginResult {
  success: boolean,
  data?: LoginResponse,
  errors?: ApiErrorDetail[],
  message?: string 
}

export interface UserProfile {
  id: number,
  fullname: string,
  phone: string,
  customerAddress: string,
  username: string,
  email: string,
}

export interface UpdateProfileRequest {
  fullname: string,
  phone: string,
  customerAddress: string
}

export interface ChangePasswordRequest {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

export interface AuthContextType {
    isAuthenticated: boolean,
    user: UserProfile | null,
    loading: boolean,
    login: (data: LoginRequest) => Promise<void>,
    loginGoogle: (idToken: string) => Promise<void>,
    logout: () => void,
    register: (data: RegisterRequest) => Promise<void>,
    changePassword: (data: ChangePasswordRequest) => Promise<boolean> 
}

export interface RegisterRequest {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  fullName: string,
  phone: string,
  customerAddress: string
}
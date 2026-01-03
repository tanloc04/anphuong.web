import type { IApiErrorDetail } from "./common.types"

export interface ILoginRequest {
  email: string,
  password: string
}

export interface ILoginResponse {
  token: string,
  refreshToken: string
}

export interface ILoginResult {
  success: boolean,
  data?: ILoginResponse,
  errors?: IApiErrorDetail[],
  message?: string 
}

export interface IUserProfile {
  id: number,
  fullname: string,
  phone: string,
  customerAddress: string,
  username: string,
  email: string,
}

export interface IUpdateProfileRequest {
  fullname: string,
  phone: string,
  customerAddress: string
}

export interface IChangePasswordRequest {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

export interface AuthContextType {
    isAuthenticated: boolean,
    user: IUserProfile | null,
    loading: boolean,
    login: (data: ILoginRequest) => Promise<void>,
    loginGoogle: (idToken: string) => Promise<void>,
    logout: () => void,
    register: (data: IRegisterRequest) => Promise<void>,
    changePassword: (data: IChangePasswordRequest) => Promise<boolean> 
}

export interface IRegisterRequest {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  fullName: string,
  phone: string,
  customerAddress: string
}
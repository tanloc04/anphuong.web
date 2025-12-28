import type { IApiErrorDetail } from "@/types"

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
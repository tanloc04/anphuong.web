import type { IApiErrorDetail } from "@/types"

export interface ICustomerProps {
  email: string,
  password: string,
  confirmPassword: string,
  username: string,
  phone: string,
  fullName: string,
  customerAddress: string
}

export interface IRegisterResponse {
  success: boolean,
  data?: any,
  errors?: IApiErrorDetail[],
  globalError?: string
}
export interface IApiErrorDetail {
  field: string,
  message: string[]
}

export interface IApiResponse<T> {
  success: boolean,
  message?: string,
  data?: T,
  errors?: any[]
}
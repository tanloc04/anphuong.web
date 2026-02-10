export interface ApiErrorDetail {
  field: string,
  message: string[]
}

export interface ApiResponse<T> {
  success: boolean,
  message?: string,
  data?: T,
  errors?: any[]
}

export interface PageInfo {
  pageNum: number,
  pageSize: number
}

export interface FormInput {
    name: string;
    description: string;
}
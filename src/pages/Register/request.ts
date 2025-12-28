import axios from 'axios'
import type { ICustomerProps, IRegisterResponse } from './types'

const API_BASE = "http://localhost:5273/api/Customer";

export const registerCustomer = async (userData: ICustomerProps): Promise<IRegisterResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register`, userData);
    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      const serverData = error.response.data;

      return {
        success: false,
        errors: serverData.errors,
        globalError: serverData.message
      }
    }

    return {
      success: false,
      globalError: "Không thể kết nối với máy chủ. Vui lòng thử lại sau!"
    }
  }
}

export const confirmAccount = async (id: number | string) : Promise<{ success: boolean, message?: string }> => {
  try {
    const response = await axios.put(`${API_BASE}/account-confirmation/${id}`);
    return {
      success: true,
      message: response.data.message || "Xác thực thành công!"
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Xác thực thất bại. Vui lòng thử lại!"
    }
  }
}
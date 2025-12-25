import axios from 'axios'
import type { ICustomerProps, IRegisterResponse } from './types'

const API_URL = "http://localhost:5273/api/Customer/test-register";

export const registerCustomer = async (userData: ICustomerProps): Promise<IRegisterResponse> => {
  try {
    const response = await axios.post(API_URL, userData);
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
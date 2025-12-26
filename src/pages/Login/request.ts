import axios from "axios"
import type { ILoginResult } from "./types"
import { axiosClient, API_BASE_URL } from "../axiosClient";


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/Auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const token = localStorage.getItem('token');

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const result = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
          token: token,
          refreshToken: refreshToken
        });

        if (result.data && result.data.success) {
          const { token: newAccessToken, refreshToken: newRefreshToken } = result.data.data;

          localStorage.setItem('token', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }

      } catch(refreshError) {
        console.log("Phiên đăng nhập đã hết hạn.");
        localStorage.clear();
        if (window.location.pathname !== '/account/login') {
          window.location.href = '/account/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get('/Auth');

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }

    return {
      success: false,
      message: response.data.message || "Không thể lấy thông tin user"
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi lấy thông tin."
    };
  }
};

export const login = async (credentials: any): Promise<ILoginResult> => {
  try {
    const response = await axiosClient.post('/Auth/login', credentials);

    if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
      };
    }

    return {
      success: false,
      message: response.data.message || "Đăng nhập thất bại"
    }
    
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || "Lỗi đăng nhập."
      };
    }

    return { success: false, message: "Lỗi mạng." };
  }
};

export const loginWithGoogle = async (idToken: string): Promise<ILoginResult> => {
  try {
    const response = await axiosClient.post('/Auth/google-login', {
      idToken: idToken
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }

    return {
      success: false,
      message: response.data.message || "Đăng nhập Google thất bại!"
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || "Lỗi xác thực Google!",
        errors: error.response.data.errors
      };
    }
    return { success: false, message: "Lỗi kết nối!" };
  }
};
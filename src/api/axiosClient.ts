import axios from "axios";

export const API_BASE_URL = "http://localhost:5273/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
          throw new Error("No refresh token available");
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
      } catch (refreshError) {
        console.log("Phiên đăng nhập hết hạn hoặc Refresh Token không hợp lệ!");
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
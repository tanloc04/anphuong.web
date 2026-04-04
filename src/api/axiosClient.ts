import axios from "axios";

// export const API_BASE_URL = "http://localhost:5273/api"; // Hardcode thế này dễ lỗi khi deploy
// Nên dùng biến môi trường, fallback về localhost nếu không có
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://locnt04-001-site1.mtempurl.com";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 👇 QUAN TRỌNG: Thêm điều kiện !includes('/Auth/refresh-token')
    // Để tránh việc chính API refresh bị lỗi lại kích hoạt interceptor lần nữa
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/Auth/login") &&
      !originalRequest.url.includes("/Auth/refresh-token") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 👇 QUAN TRỌNG: Thêm {} vào body để tránh lỗi 400 Bad Request từ phía C# [FromBody]
        await axiosClient.post("/Auth/refresh-token", {});

        processQueue(null, "success");

        // Gọi lại request ban đầu (Lúc này trình duyệt tự kẹp cookie mới vào)
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.log("Phiên đăng nhập hết hạn hoặc lỗi Refresh!");

        // Chỉ redirect nếu không phải đang ở trang login
        if (window.location.pathname !== "/account/login") {
          window.location.href = "/account/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

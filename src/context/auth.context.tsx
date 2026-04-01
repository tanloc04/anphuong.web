import { createContext, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { cartApi } from "@/api/cartApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LoginRequest,
  AuthContextType,
  UserProfile,
  RegisterRequest,
  ChangePasswordRequest,
} from "@/@types/auth.types";
import { Toast } from "primereact/toast";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useRef<Toast>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") ||
      (localStorage.getItem("isLoggedIn") === "true" ? "cookie-mode" : null),
  );
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const {
    data: user,
    isLoading: isLoadingProfile,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user-account-info"],
    queryFn: async () => {
      const res = await authApi.getAccountInfo();
      if (res.data?.success) {
        return res.data.data as UserProfile;
      }
      return null;
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  const isAuthenticated = !!token && !isError;

  const showToast = (
    severity: "success" | "error" | "info" | "warn",
    summary: string,
    detail: string,
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const syncLocalCartToServer = async () => {
    try {
      const localCartStr = localStorage.getItem("cart");
      if (!localCartStr) return;

      const localCart = JSON.parse(localCartStr);
      if (!Array.isArray(localCart) || localCart.length === 0) return;

      const syncPayload = localCart.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
      }));

      await cartApi.syncCart(syncPayload);

      localStorage.removeItem("cart");
      console.log("Đồng bộ giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi đồng bộ giỏ hàng lúc Login:", error);
    }
  };

  const handleLoginSuccess = async (responseData: any) => {
    // if (responseData?.token) {
    //     localStorage.setItem('token', responseData.token);
    //     localStorage.setItem('refreshToken', responseData.refreshToken);
    //     setToken(responseData.token);
    // } else {
    //     ;
    // }
    // setToken('cookie-mode');

    // const userRes = await refetch();
    // const userData = userRes.data;

    // const displayName = userData?.username || userData?.email || "User";
    // showToast('success', 'Đăng nhập thành công!', `Chào mừng ${displayName} quay lại!`);
    // navigate("/");

    setToken("cookie-mode");

    localStorage.setItem("isLoggedIn", "true");

    // ----------------------------------------------------

    // Fetch lại thông tin user (Lúc này Axios bắt buộc phải tự dùng Cookie để gửi đi)
    try {
      const userRes = await refetch();
      const userData = userRes.data;

      if (userData) {
        await syncLocalCartToServer();
        const displayName = userData?.username || userData?.email || "User";
        showToast(
          "success",
          "Đăng nhập thành công",
          `Chào mừng ${displayName} quay lại!`,
        );
        navigate("/");
      } else {
        showToast("error", "Lỗi Cookie", "Không đọc được Cookie từ Backend!");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Lỗi kết nối", "Không thể xác thực người dùng.");
    }
  };

  // const resendEmail = async (email: string) => {
  //   try {
  //     setIsActionLoading(true);
  //     await authApi.sendEmail(email);
  //     showToast("success", "Đã gửi", "Vui lòng kiểm tra hộp thư của bạn.");
  //   } catch (error) {
  //     showToast("error", "Lỗi", "Không thể gửi email kích hoạt!");
  //   } finally {
  //     setIsActionLoading(false);
  //   }
  // };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsActionLoading(true);
      const res = await authApi.login(credentials);

      if (res.data && res.data.success) {
        await handleLoginSuccess(res.data.data);
      } else {
        showToast(
          "error",
          "Đăng nhập thất bại",
          res.data.message || "Vui lòng kiểm tra lại thông tin!",
        );
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi kết nối server!";
      showToast("error", "Có lỗi xảy ra!", msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const loginGoogle = async (credential: string) => {
    try {
      setIsActionLoading(true);
      const res = await authApi.loginWithGoogle(credential);

      if (res.data?.success || res.data?.token) {
        await handleLoginSuccess(res.data.data);
      } else {
        showToast(
          "error",
          "Thất bại",
          res.data.message || "Đăng nhập Google thất bại!",
        );
      }
    } catch (error: any) {
      if (
        error.response?.status === 403 ||
        error.response?.data?.message?.includes("not activated")
      ) {
        throw error;
      }
      const msg = error.response?.data?.message || "Lỗi xác thực Google!";
      showToast("error", "Lỗi xác thực!", msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsActionLoading(true);
      const response = await authApi.register(data);
      if (response.data && response.data.success) {
        // try {
        //   await authApi.sendEmail(data.email);
        // } catch (emailError) {
        //   console.warn("Đăng ký thành công nhưng gửi mail lỗi:", emailError);
        // }

        showToast(
          "success",
          "Đăng ký thành công",
          "Vui lòng kiểm tra Email để kích hoạt tài khoản!",
        );
        navigate("/account/login");
      } else {
        showToast(
          "warn",
          "Đăng ký thất bại",
          response.data.message || "Vui lòng kiểm tra lại!",
        );
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi kết nối server!";
      showToast("error", "Có lỗi xảy ra", msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const changePassword = async (
    data: ChangePasswordRequest,
  ): Promise<boolean> => {
    try {
      const response = await authApi.changePassword(data);
      if (response.data && response.data.success) {
        showToast("success", "Thành công", "Đổi mật khẩu thành công!");
        return true;
      } else {
        showToast(
          "error",
          "Thất bại",
          response.data.message || "Không thể đổi mật khẩu!",
        );
        return false;
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi hệ thống!";
      showToast("error", "Lỗi", msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsActionLoading(true);
      await authApi.logout();
    } catch (error) {
      console.log("Lỗi logout backend", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      setToken(null);

      localStorage.removeItem("isLoggedIn");

      queryClient.removeQueries({ queryKey: ["user-account-info"] });
      queryClient.removeQueries({ queryKey: ["cart-data"] });

      showToast("info", "Đăng xuất", "Hẹn gặp lại bạn!");
      setIsActionLoading(false);
      navigate("/account/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: user || null,
        loading: isLoadingProfile || isActionLoading,
        login,
        loginGoogle,
        // resendEmail,
        logout,
        register,
        changePassword,
      }}
    >
      <Toast ref={toast} position="top-right" />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

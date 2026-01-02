import { createContext, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ILoginRequest, AuthContextType, IUserProfile, IRegisterRequest, IChangePasswordRequest } from "@/types/auth.types";
import { Toast } from "primereact/toast";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useRef<Toast>(null);

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const {
        data: user,
        isLoading: isLoadingProfile,
        isError,
        refetch
    } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const res = await authApi.getUserProfile();
            if (res.data?.success && res.data.data?.pageData?.length > 0) {
                return res.data.data.pageData[0] as IUserProfile;
            }
            return null;
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        retry: false
    });
    const isAuthenticated = !!token && !isError;

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    }

    const login = async (credentials: ILoginRequest) => {
        try {
            const response = await authApi.login(credentials);
            if (response.data && response.data.success) {
                const { token: newToken, refreshToken, username } = response.data.data;

                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('username', username);

                setToken(newToken);
                await refetch();
                showToast('success', 'Đăng nhập thành công', `Chào mừng ${username} quay lại!`);
                navigate('/');
            } else {
                showToast('error', 'Đăng nhập thất bại', response.data.message || 'Vui lòng kiểm tra lại thông tin!');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Lỗi kết nối server!';
            showToast('error', 'Có lỗi xảy ra', msg);
        }
    };

    const loginGoogle = async (idToken: string) => {
        try {
            const response = await authApi.loginWithGoogle(idToken);
            if (response.data && response.data.success) {
                const { token: newToken, refreshToken, username } = response.data.data;
                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('username', username);

                setToken(newToken);
                await refetch();
                showToast('success', 'Thành công', 'Đăng nhập Google thành công!');
                navigate('/');
            } else {
                showToast('error', 'Thất bại', response.data.message || 'Đăng nhập bằng Google thất bại!');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Lỗi xác thực Google!';
            showToast('error', 'Lỗi xác thực!', msg);
        }
    };

    const register = async (data: IRegisterRequest) => {
        try {
            const response = await authApi.register(data);
            if (response.data && response.data.success) {
                showToast('success', 'Đăng ký thành công', 'Vui lòng kiểm tra Email để kích hoạt tài khoản!');
                navigate('/account/login');
            } else {
                if (response.data.errors) {
                    showToast('warn', 'Đăng ký thất bại', 'Vui lòng kiểm tra lại thông tin nhập!');
                } else {
                    showToast('error', 'Đăng ký thất bại', response.data.message || "Lỗi không xác định!");
                }
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi kết nối server!";
            showToast('error', 'Có lỗi xảy ra', msg);
        }
    };

    const changePassword = async (data: IChangePasswordRequest): Promise<boolean> => {
        try {
            const response = await authApi.changePassword(data);
            if (response.data && response.data.success) {
                showToast('success', 'Thành công', 'Đổi mật khẩu thành công!');
                return true;
            } else {
                showToast('error', 'Thất bại', response.data.message || 'Không thể đổi mật khẩu!');
                return false;
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi hệ thống!";
            showToast('error', 'Lỗi', msg);
            return false;
        }
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        queryClient.removeQueries({ queryKey: ['user-profile'] });
        queryClient.clear();

        showToast('info', 'Đăng xuất', 'Hẹn gặp lại bạn!');
        navigate('/account/login');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user: user || null,
            loading: isLoadingProfile,
            login,
            loginGoogle,
            logout,
            register,
            changePassword
        }}>
            <Toast ref={toast} position="top-right"/>
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
};
import axiosClient from "./axiosClient";
import type { LoginRequest, ChangePasswordRequest, UpdateProfileRequest, RegisterRequest } from "@/@types/auth.types";

export const authApi = {
    login: (data: LoginRequest) => {
        return axiosClient.post('/Auth/login', data);
    },

    loginWithGoogle: (idToken: string) => {
        return axiosClient.post('/Auth/google-login', { idToken });
    },

    logout: () => {
        return axiosClient.post('/Auth/logout');
    },

    register: (data: RegisterRequest) => {
        return axiosClient.post('/Customer/register', data);
    },

    sendEmail: async (email: string) => {
        return axiosClient.post('/Customer/send-email', null, {
            params: { email: email }
        });
    },

    refreshToken: (token: string, refreshToken: string) => {
        return axiosClient.post('/Auth/refresh-token', { token, refreshToken });
    },

    changePassword: (data: ChangePasswordRequest) => {
        return axiosClient.post('/Auth/password', data);
    },

    getAccountInfo: () => {
        return axiosClient.get('/Auth'); 
    },

    getCustomerDetail: (username: string) => {
        return axiosClient.post('/Customer/search', {
            searchCondition: { keyword: username, isDeleted: false },
            pageInfo: { pageNum: 1, pageSize: 1 }
        });
    },

    updateProfile: (id: number, data: UpdateProfileRequest) => {
        return axiosClient.put(`/Customer/${id}`, data);
    },
};
import axiosClient from "./axiosClient";
import type { ILoginRequest, IChangePasswordRequest, IUpdateProfileRequest, IRegisterRequest } from "@/types/auth.types";

export const authApi = {
    login: (data: ILoginRequest) => {
        return axiosClient.post('/Auth/login', data);
    },

    loginWithGoogle: (idToken: string) => {
        return axiosClient.post('/Auth/google-login', { idToken });
    },

    register: (data: IRegisterRequest) => {
        return axiosClient.post('/Customer/register', data);
    },

    refreshToken: (token: string, refreshToken: string) => {
        return axiosClient.post('/Auth/refresh-token', { token, refreshToken });
    },

    changePassword: (data: IChangePasswordRequest) => {
        return axiosClient.post('/Auth/password', data);
    },

    getUserProfile: () => {
        const username = localStorage.getItem('username');
        return axiosClient.post('/Customer/search', {
            searchCondition: { keyword: username, isDeleted: false },
            pageInfo: { pageNum: 1, pageSize: 1 }
        });
    },

    updateProfile: (id: number, data: IUpdateProfileRequest) => {
        return axiosClient.put(`/Customer/${id}`, data);
    },


};
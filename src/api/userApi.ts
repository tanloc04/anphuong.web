import type { IUpdateUserRequest, ISearchUserRequest } from "@/types/user.types";
import axiosClient from "./axiosClient";

export const userApi = {
    search : (data: ISearchUserRequest) => {
        return axiosClient.post('/User/search', data);
    },

    getById : (id: number) => {
        return axiosClient.get(`/User/${id}`);
    },
    
    update : (id: number, data: IUpdateUserRequest) => {
        return axiosClient.put(`/User/${id}`, data);
    },

    delete : (id: number) => {
        return axiosClient.delete(`/User/${id}`);
    }
};

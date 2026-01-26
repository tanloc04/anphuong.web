import type { IUpdateUserRequest, ISearchUserRequest } from "@/types/user.types";
import axiosClient from "./axiosClient";

export const userApi = {
    search: (data: ISearchUserRequest): Promise<any> => {
        return axiosClient.post('/Customer/search', data);
    },

    getById: (id: number): Promise<any> => {
        return axiosClient.get(`/Customer/${id}`);
    },

    update: (id: number, data: IUpdateUserRequest): Promise<any> => {
        return axiosClient.put(`/Customer/${id}`, data);
    },

    delete: (id: number): Promise<any> => {
        return axiosClient.delete(`/Customer/${id}`);
    }
};
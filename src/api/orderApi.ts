import type { ICreateOrderRequest, IOrderRequest } from "@/types/order.types";
import axiosClient from "./axiosClient";


export const orderApi = {
    search: (data: IOrderRequest): Promise<any> => {
        return axiosClient.post('/Order/search', data);
    },

    getById: (id: number): Promise<any> => {
        return axiosClient.get(`/Order/${id}`);
    },

    create: (data: ICreateOrderRequest): Promise<any> => {
        return axiosClient.post('/Order/create', data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Order/${id}`);
    }
} 
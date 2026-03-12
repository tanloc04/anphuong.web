import type { CreateOrderRequest, OrderRequest } from "@/@types/order.types";
import axiosClient from "./axiosClient";

export const orderApi = {
    search: (data: OrderRequest): Promise<any> => {
        return axiosClient.post('/Order/search', data);
    },

    getById: (id: number): Promise<any> => {
        return axiosClient.get(`/Order/${id}`);
    },

    create: (data: CreateOrderRequest): Promise<any> => {
        return axiosClient.post('/Order/create', data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Order/${id}`);
    },

    updateStatus: ({ id, status } : { id: number, status: number }): Promise<any> => {
        return axiosClient.patch(`/Order/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
    },
    
    getRevenue: (data: any): Promise<any> => {
        return axiosClient.post('/Order/revenue', data);
    }
} 
import type { IProductRequest, IProductSearchRequest } from "@/types/product.types";
import axiosClient from "./axiosClient";

export const productApi = {
    search: (data: IProductSearchRequest) => {
        return axiosClient.post('/Product/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Product/${id}`);
    },

    create: (data: IProductRequest) => {
        return axiosClient.post('/Product/create', data);
    },

    update: (id: number, data: IProductRequest) => {
        return axiosClient.put(`/Product/${id}`, data);
    },  

    delete: (id: number) => {
        return axiosClient.delete(`/Product/${id}`);
    }
};
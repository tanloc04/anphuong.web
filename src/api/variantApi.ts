import type { ISearchVariantRequest, IVariantRequest } from "@/types/variant.types";
import axiosClient from "./axiosClient";

export const variantApi = {
    search: (data: ISearchVariantRequest) => {
        return axiosClient.post('/Variant/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Variant/${id}`);
    },

    create: (data: IVariantRequest) => {
        return axiosClient.post('/Variant/create', data);
    },

    update: (id: number, data: IVariantRequest) => {
        return axiosClient.put(`/Variant/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Variant/${id}`);
    }
};
import type { SearchVariantRequest, VariantRequest } from "@/@types/variant.types";
import axiosClient from "./axiosClient";

export const variantApi = {
    search: (data: SearchVariantRequest) => {
        return axiosClient.post('/Variant/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Variant/${id}`);
    },

    create: (data: VariantRequest) => {
        return axiosClient.post('/Variant/create', data);
    },

    update: (id: number, data: VariantRequest) => {
        return axiosClient.put(`/Variant/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Variant/${id}`);
    }
};
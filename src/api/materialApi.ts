import type { CreateMaterialRequest } from "@/@types/material.types";
import axiosClient from "./axiosClient";

export const materialApi = {
    search: (data: any): Promise<any> => {
        return axiosClient.post('/Material/search', data);
    },

    getById: (id: number): Promise<any> => {
        return axiosClient.get(`/Material/${id}`);
    },

    create: (data: CreateMaterialRequest): Promise<any> => {
        return axiosClient.post('/Material/create', data);
    },

    update: (id: number, data: CreateMaterialRequest): Promise<any> => {
        return axiosClient.put(`/Material/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Material/${id}`);
    }
}
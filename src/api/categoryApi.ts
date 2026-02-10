import type { Category, SearchCategoryRequest, CategoryRequest } from "@/@types/category.types";
import axiosClient from "./axiosClient";


export const categoryApi = {
    search: (data: SearchCategoryRequest) => {
        return axiosClient.post('/Category/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Category/${id}`);
    },

    create: (data: CategoryRequest) => {
        return axiosClient.post('/Category/create', data);
    },

    update: (id: number, data: CategoryRequest) => {
        return axiosClient.put(`/Category/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Category/${id}`);
    }
};
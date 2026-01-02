import type { ICategory, ISearchCategoryRequest, ICategoryRequest } from "@/types/category.types";
import axiosClient from "./axiosClient";


export const categoryApi = {
    search: (data: ISearchCategoryRequest) => {
        return axiosClient.post('/Category/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Category/${id}`);
    },

    create: (data: ICategoryRequest) => {
        return axiosClient.post('/Category/create', data);
    },

    update: (id: number, data: ICategoryRequest) => {
        return axiosClient.put(`/Category/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete(`/Category/${id}`);
    }
};
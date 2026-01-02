import type { IColorRequest, ISearchColorRequest } from "@/types/color.types";
import axiosClient from "./axiosClient";

export const colorApi = {
    search: (data: ISearchColorRequest) => {
        return axiosClient.post('/Color/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Color/${id}`);
    },

    create: (data: IColorRequest) => {
        return axiosClient.post('/Color/create', data);
    },

    update: (id: number, data: IColorRequest) => {
        return axiosClient.put(`/Color/${id}`, data);
    }
};
import type { ColorRequest, SearchColorRequest } from "@/@types/color.types";
import axiosClient from "./axiosClient";

export const colorApi = {
    search: (data: SearchColorRequest) => {
        return axiosClient.post('/Color/search', data);
    },

    getById: (id: number) => {
        return axiosClient.get(`/Color/${id}`);
    },

    create: (data: ColorRequest) => {
        return axiosClient.post('/Color/create', data);
    },

    update: (id: number, data: ColorRequest) => {
        return axiosClient.put(`/Color/${id}`, data);
    }
};
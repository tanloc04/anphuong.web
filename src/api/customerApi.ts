import type { UpdateCustomerRequest, SearchCustomerRequest } from "@/@types/customer.types";
import axiosClient from "./axiosClient";

export const customerApi = {
    search: (data: SearchCustomerRequest): Promise<any> => {
        return axiosClient.post('/Customer/search', data);
    },

    getById: (id: number): Promise<any> => {
        return axiosClient.get(`/Customer/${id}`);
    },

    update: (id: number, data: UpdateCustomerRequest): Promise<any> => {
        return axiosClient.put(`/Customer/${id}`, data);
    },

    delete: (id: number): Promise<any> => {
        return axiosClient.delete(`/Customer/${id}`);
    }
};
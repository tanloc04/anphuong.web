import type {
  ProductRequest,
  ProductSearchRequest,
} from "@/@types/product.types";
import axiosClient from "./axiosClient";

export const productApi = {
  search: (data: ProductSearchRequest) => {
    return axiosClient.post("/Product/search", data);
  },

  getById: (id: number) => {
    return axiosClient.get(`/Product/${id}`);
  },

  create: (data: ProductRequest) => {
    return axiosClient.post("/Product/create", data);
  },

  update: (id: number, data: ProductRequest) => {
    return axiosClient.put(`/Product/${id}`, data);
  },

  delete: (id: number) => {
    return axiosClient.delete(`/Product/${id}`);
  },

  getLowStockCount: async (threshold: number = 5): Promise<number> => {
    const response = await axiosClient.get(
      `/Product/low-stock-count?threshold=${threshold}`,
    );
    return response.data;
  },
};

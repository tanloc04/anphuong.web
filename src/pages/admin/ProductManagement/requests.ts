//Lấy các API bên BE để sử dụng.
import { axiosClient, API_BASE_URL } from "@/pages/axiosClient";
import type { ProductProps, IProductSearchRequest, IProductSearchResponse, IColor } from "./types";
import type { IApiResponse } from "@/types";

export const searchProducts = async (payload: IProductSearchRequest): Promise<IProductSearchResponse> => {
  const response = await axiosClient.post<IProductSearchResponse>(`${API_BASE_URL}/Product/search`, payload);
  return response.data;
};

export const createProduct = async (formData: FormData): Promise<IApiResponse<ProductProps>> => {
  const response = await axiosClient.post<IApiResponse<ProductProps>>(`${API_BASE_URL}/Product/create`, formData);
  return response.data;
};

export const updateProduct = async (id: number, formData: FormData): Promise<IApiResponse<ProductProps>> => {
  const response = await axiosClient.put<IApiResponse<ProductProps>>(`${API_BASE_URL}/Product/${id}`, formData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<IApiResponse<ProductProps>> => {
  const response = await axiosClient.delete<IApiResponse<any>>(`${API_BASE_URL}/Product/${id}`);
  return response.data;
};

export const getAllColors = async (): Promise<IApiResponse<{ pageData: IColor[] }>> => {
  try {
    const payload = {
      searchCondition: {
        keyword: "",
        status: "",
        isDeleted: false,
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 1000
      }
    };

    const response = await axiosClient.post(`${API_BASE_URL}/Color/search`, payload);

    return {
      success: true,
      data: response.data?.data
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const createColor = async (data: { name: string, hexCode: string }): Promise<IApiResponse<IColor>> => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/Color/create`, data);
    return {
      success: true,
      data: response.data?.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi tạo màu!"
    }
  }
};

export const createVariant = (data: { productId: number, colorId: number }) => {
  return axiosClient.post(`/Variant/create`, data);
};

export const searchVariants = (productId: number) => {
  const payload = {
      searchCondition: {
          productId: productId,
          isDeleted: false,
          status: ""
      },
      pageInfo: {
          pageNum: 1,
          pageSize: 100
      }
  };
  return axiosClient.post('/Variant/search', payload);
};

export const deleteVariant = (variantId: number) => {
  return axiosClient.delete(`/Variant/${variantId}`);
};
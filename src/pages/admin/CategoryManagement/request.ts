import type { IApiResponse } from "@/types";
import type { ISearchCategoryRequest, ISearchCategoryResponse } from "./types";
import { axiosClient, API_BASE_URL } from "@/pages/axiosClient";


//Các API của Category

//Search mà điều kiện là {} thì là getAll, có điều kiện trong đó thì ta sẽ làm searchBox sau, hiện tại cứ getAll
export const searchCate = async (payload?: ISearchCategoryRequest): Promise<IApiResponse<ISearchCategoryResponse>> => {
  try {
    const finalPayload = {
      searchCondition: {
        keyword: payload?.searchCondition || "",
        isDeleted: false
      },
      pageIndex: payload?.pageIndex || 1,
      pageSize: payload?.pageSize || 10,
    };

    console.log("Payload chuẩn gửi đi:", finalPayload);

    const response = await axiosClient.post(`${API_BASE_URL}/Category/search`, finalPayload);

    return {
      success: true,
      data: response.data?.data
    };
  } catch (error: any) {
    console.error("Lỗi searchCate: ", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tải danh sách danh mục!"
    };
  }
};

export const createCate = async (data: { name: string; description: string }) => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/Category/create`, data);

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Lỗi tạo danh mục!" };
  }
};

export const updateCate = async (id: string, data: { name: string, description: string }) => {
  try {
    const response = await axiosClient.put(`${API_BASE_URL}/Category/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Lỗi cập nhật danh mục!" };
  }
};

export const deleteCate = async (id: string) => {
  try {
    const response = await axiosClient.delete(`${API_BASE_URL}/Category/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Lỗi xóa danh mục!"};
  }
};
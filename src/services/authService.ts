import axiosClient from "@/api/axiosClient";

export const authService = {
    confirmAccount: async (id: string) => {
        try {
            const response = await axiosClient.put(`/Customer/account-confirmation/${id}`);

            return {
                success: true,
                message: response.data?.message || "Kích hoạt thành công!",
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Liên kết không hợp lệ hoặc lỗi hệ thống!"
            }
        }
    },
}
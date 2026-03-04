import { useQuery } from "@tanstack/react-query";
import { materialApi } from "@/api/materialApi";

export const useMaterials = (params?: any) => {
  // Payload mặc định để lấy 100 chất liệu đầu tiên nhét vào Dropdown
  const defaultPayload = params || {
    pageInfo: { pageNum: 1, pageSize: 100 },
    searchCondition: { keyword: "", isDeleted: false }
  };

  return useQuery({
    queryKey: ['materials', defaultPayload],
    queryFn: async () => {
      const response = await materialApi.search(defaultPayload);
      
      // Axios bọc kết quả trong response.data
      // Backend của bạn bọc tiếp trong thuộc tính 'data' (viết thường do JSON Serialize của .NET)
      const resultData = response.data?.data; 

      return {
        // Trích xuất đúng mảng pageData ra
        pageData: resultData?.pageData || [],
        totalItems: resultData?.totalItems || 0
      };
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút cho Dropdown mượt mà
  });
};
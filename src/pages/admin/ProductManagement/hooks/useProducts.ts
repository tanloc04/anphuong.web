import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchProducts } from "@/pages/admin/ProductManagement/requests";
import type { IProductSearchRequest } from "@/pages/admin/ProductManagement/types";

export const useProducts = (searchCondition: any, pageInfo: { pageNum: number, pageSize: number }) => {
  return useQuery({
    queryKey: ['products', searchCondition, pageInfo],
    queryFn: async () => {
      const payload: IProductSearchRequest = {
        searchCondition: searchCondition,
        pageInfo: pageInfo
      };
      const response = await searchProducts(payload);
      return response;
    },

    placeholderData: keepPreviousData,
    staleTime: 60 * 1000
  })
};
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { orderApi } from "@/api/orderApi";
import type { IOrderRequest, IOrderResponse } from "@/types/order.types";

export const useOrders = (params: IOrderRequest) => {
    return useQuery({
        queryKey: ['orders', params],
        queryFn: () => orderApi.search(params),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        select: (response: any) => {
            if (response?.data?.pageData) {
                return response.data;
            }

            if (response?.pageData) {
                return response;
            }

            return { pageData: [], pageInfo: {} };
        }
    });
}
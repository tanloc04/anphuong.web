import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { customerApi } from "@/api/customerApi";
import type { SearchCustomerRequest } from "@/@types/customer.types";

export const useCustomers = (params: SearchCustomerRequest) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.search(params),
    placeholderData: keepPreviousData, 
    staleTime: 60 * 1000, 
  });
};
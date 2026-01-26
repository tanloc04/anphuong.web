import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { userApi } from "@/api/userApi";
import type { ISearchUserRequest } from "@/types/user.types";

export const useUsers = (params: ISearchUserRequest) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.search(params),
    placeholderData: keepPreviousData, 
    staleTime: 60 * 1000, 
  });
};
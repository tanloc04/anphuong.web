import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { userApi } from "@/api/userApi";
import type { SearchUserRequest } from "@/@types/user.types";

export const useUsers = (params: SearchUserRequest) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.search(params),
    placeholderData: keepPreviousData, 
    staleTime: 60 * 1000, 
  });
};
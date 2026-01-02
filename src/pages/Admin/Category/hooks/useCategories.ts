import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/api/categoryApi";
import type { ISearchCategoryRequest } from "@/types/category.types";

const defaultSearch: ISearchCategoryRequest = {
    searchCondition: { keyword: "", isDeleted: false, status: "" },
    pageInfo: { pageNum: 1, pageSize: 100 }
};

export const useCategories = (searchParams?: Partial<ISearchCategoryRequest>) => {
    const params = { ...defaultSearch, ...searchParams };

    return useQuery({
        queryKey: ['categories', params],
        queryFn: async () => {
            const res = await categoryApi.search(params);
            return res.data?.data || { pageData: [], pageInfo: { totalItems: 0 } };
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    });
}
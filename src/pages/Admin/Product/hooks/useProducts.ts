import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { productApi } from "@/api/productApi";
import type { ProductSearchRequest } from "@/@types/product.types";

const defaultSearch: ProductSearchRequest = {
    searchCondition: {
        keyword: "",
        status: "",
        isDeleted: false
    },

    pageInfo: { pageNum: 1, pageSize: 100 }
};

export const useProducts = (searchParams?: Partial<ProductSearchRequest>) => {
    const params = {
        ...defaultSearch,
        ...searchParams,
        searchCondition: { ...defaultSearch.searchCondition, ...searchParams?.searchCondition }
    };

    return useQuery({
        queryKey: ['product', params],
        queryFn: async () => {
            const res = await productApi.search(params);
            return res.data?.data || { pageData: [], pageInfo: { totalItems: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000
    });
};

export const useProductDetail = (id: number | null) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            if (!id) {
                return null;
            }
            const res = await productApi.getById(id);
            return res.data?.data;
        },

        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
};
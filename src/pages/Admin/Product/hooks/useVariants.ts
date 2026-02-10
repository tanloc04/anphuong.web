import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { variantApi } from "@/api/variantApi";
import { colorApi } from "@/api/colorApi";
import type { ISearchVariantRequest } from "@/@types/variant.types";
import type { ISearchColorRequest } from "@/@types/color.types";

export const useColors = (searchParams?: Partial<ISearchColorRequest>) => {
    const defaultParams: ISearchColorRequest = {
        searchCondition: { keyword: "", status: "", isDeleted: false },
        pageInfo: { pageNum: 1, pageSize: 100 }
    };

    const params = { ...defaultParams, ...searchParams };

    return useQuery({
        queryKey: ['color', params],
        queryFn: async () => {
            const res = await colorApi.search(params);
            return res.data?.data || { pageData: [], pageInfo: { totalItems: 0 } };
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useVariants = (productId: number | null, searchParams?: Partial<ISearchVariantRequest>) => {
    const isEnabled = !!productId;

    const defaultParams: ISearchVariantRequest = {
        searchCondition: {
            productId: productId || 0,
            status: "",
            isDeleted: false
        },
        pageInfo: { pageNum: 1, pageSize: 50 }
    };

    const params = {
        ...defaultParams,
        ...searchParams,
        searchCondition: { ...defaultParams.searchCondition, ...searchParams?.searchCondition }
    };

    return useQuery({
        queryKey: ['variants', productId, params],
        queryFn: async () => {
            if (!productId) return { pageData: [], pageInfo: { totalItems: 0 } };
            const res = await variantApi.search(params);
            return res.data?.data || { pageData: [], pageInfo: { totalItems: 0 } };
        },
        enabled: isEnabled,
        placeholderData: keepPreviousData
    });
};
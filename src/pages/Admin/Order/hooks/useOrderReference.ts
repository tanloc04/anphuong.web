import { useQuery } from "@tanstack/react-query"
import { customerApi } from "@/api/customerApi"
import { variantApi } from "@/api/variantApi"
import { productApi } from "@/api/productApi";

export const useCustomersSelect = (keyword: string = "") => {
    return useQuery ({
        queryKey: ['customers', 'select', keyword],
        queryFn: async () => {
            const res = await customerApi.search({
                searchCondition: { keyword, status: 'ACTIVE', isDeleted: false },
                pageInfo: { pageNum: 1, pageSize: 50 }
            });
            return res.data?.data?.pageData || [];
        },

        staleTime: 5 * 60 * 1000,
    });
};

export const useProductSelect = (keyword: string = "") => {
    return useQuery ({
        queryKey: ['products', 'select', keyword],
        queryFn: async () => {
            const res = await productApi.search({
                searchCondition: { keyword, isDeleted: false, status: 'ACTIVE' },
                pageInfo: { pageNum: 1, pageSize: 20 }
            });
            return res.data?.data?.pageData || [];
        },

        placeholderData: (previousData) => previousData
    });
}; 

export const useVariantByProduct = (productId: number | null) => {
    return useQuery({
        queryKey: ['variants', 'by-product', productId],
        queryFn: async () => {
            if (!productId) return [];
            const res = await variantApi.search({
                searchCondition: { productId: productId, isDeleted: false, status: 'ACTIVE' },
                pageInfo: { pageNum: 1, pageSize: 50 }
            });
            return res.data?.data?.pageData || [];
        },
        enabled: !!productId,
    });
};
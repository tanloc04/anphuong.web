import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productApi } from "@/api/productApi";
import type { IClientProductSearchCondition } from "@/types/product.types";

const defaultSearch = {
    keyword: "", 
    isDeleted: false, 
    status: "ACTIVE"
};

export const useClientProducts = (condition: IClientProductSearchCondition) => {
    const serverParams = {
        searchCondition: {
            keyword: condition.keyword || "",
            isDeleted: false,
            status: "ACTIVE"
        },
        pageInfo: { pageNum: 1, pageSize: 100 }
    };

    return useQuery({
        queryKey: ['client-products', serverParams], 
        queryFn: async () => {
            const res = await productApi.searchClient(serverParams);
            return res.data?.data?.pageData || []; 
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { variantApi } from "@/api/variantApi";
import { colorApi } from "@/api/colorApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { IColorRequest } from "@/types/color.types";
import type { IVariantRequest } from "@/types/variant.types";

export const useVariantMutations = (toastRef: RefObject<Toast>) => {
    const queryClient = useQueryClient();
    const onSuccess = (message: string, queryKeyToInvalidate: string[]) => {
        toastRef.current?.show({ severity: 'success', summary: 'Thành công', detail: message });
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    };

    const onError = (error: any) => {
        const msg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
        toastRef.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg });
    }

    const createColorMutation = useMutation({
        mutationFn: (data: IColorRequest) => colorApi.create(data),
        onSuccess: () => onSuccess('Tạo màu sắc thành công!', ['colors']),
        onError
    });

    const createVariantMutation = useMutation({
        mutationFn: (data: IVariantRequest) => variantApi.create(data),
        onSuccess: () => onSuccess('Thêm biến thể thành công!', ['variants']),
        onError
    });

    const updateVariantMutation = useMutation({
        mutationFn: ({ id, data }: {id: number, data: IVariantRequest }) => variantApi.update(id, data),
        onSuccess: () => onSuccess('Cập nhật biến thể thành công!', ['variants']),
        onError
    });

    const deleteVariantMutation = useMutation({
        mutationFn: variantApi.delete,
        onSuccess: () => onSuccess('Đã xóa biến thể!', ['variants']),
        onError
    });

    return {
        createColor: createColorMutation.mutate,
        createVariant: createVariantMutation.mutate,
        updateVariant: updateVariantMutation.mutate,
        deleteVariant: deleteVariantMutation.mutate,
        isCreatingColor: createColorMutation.isPending,
        isMutatingVariant: createVariantMutation.isPending || updateVariantMutation.isPending || deleteVariantMutation.isPending
    };
};
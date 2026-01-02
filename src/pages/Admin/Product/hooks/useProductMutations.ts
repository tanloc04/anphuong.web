import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/productApi";
import { uploadToCloudinary } from "@/services/uploadCloudinary";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { ProductFormData, IProductRequest } from "@/types/product.types";

export const useProductMutations = (toastRef: RefObject<Toast>) => {
    const queryClient = useQueryClient();

    const prepareDataBeforeSubmit = async (formData: ProductFormData): Promise<IProductRequest> => {
        const payload: any = { ...formData };
        const imageFields = ['thumbnail', 'image1', 'image2', 'image3', 'image4'];

        for (const field of imageFields) {
            const fileOrUrl = payload[field];
            if (fileOrUrl instanceof File) {
                const url = await uploadToCloudinary(fileOrUrl);
                if (!url) {
                    throw new Error (`Lỗi upload ảnh ở trường ${field}`);
                }
                payload[field] = url
            }
            else if (fileOrUrl === null) {
                payload[field] = "";
            }
        }
        return payload as IProductRequest;
    };

    const createMutation = useMutation({
        mutationFn: async (formData: ProductFormData) => {
            const apiPayload = await prepareDataBeforeSubmit(formData);
            return productApi.create(apiPayload);
        },

        onSuccess: () => {
            toastRef.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tạo sản phẩm mới thành công!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },

        onError: (error: any) => {
            const msg = error.message || error.response?.data?.message || 'Có lỗi xảy ra!';
            toastRef.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: {id: number, data: IProductRequest}) => {
            const apiPayload = await prepareDataBeforeSubmit(data);
            return productApi.update(id, apiPayload);
        },

        onSuccess: () => {
            toastRef.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },

        onError: (error: any) => {
            const msg = error.message || error.response?.data?.message || 'Có lỗi xảy ra!';
            toastRef.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg })
        }
    });

    const deleteMutation = useMutation({
        mutationFn: productApi.delete,
        onSuccess: () => {
            toastRef.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa sản phẩm thành công!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },

        onError: (error: any) => {
            toastRef.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm này!' });
        }
    });

    return {
        create: createMutation.mutate,
        update: updateMutation.mutate,
        remove: deleteMutation.mutate,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    }
}
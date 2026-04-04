import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/productApi";
import { uploadToCloudinary } from "@/services/uploadCloudinaryService";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { ProductFormData, ProductRequest } from "@/@types/product.types";

export const useProductMutations = (toastRef: RefObject<Toast>) => {
    const queryClient = useQueryClient();

    const prepareDataBeforeSubmit = async (formData: ProductFormData): Promise<ProductRequest> => {
        const payload: any = { ...formData };
        
        // Đã gỡ bỏ 'thumbnail' theo giao diện mới chốt
        const imageFields = ['image1', 'image2', 'image3', 'image4'];

        // 1. CHUẨN BỊ MẢNG PROMISE CHO TẤT CẢ CÁC ẢNH
        const uploadPromises = imageFields.map(async (field) => {
            const fileOrUrl = payload[field];
            
            if (fileOrUrl instanceof File) {
                const url = await uploadToCloudinary(fileOrUrl);
                if (!url) throw new Error(`Lỗi upload ảnh ở trường ${field}`);
                return { field, url };
            } 
            else if (fileOrUrl === null) {
                return { field, url: "" };
            }
            // Nếu đã là string (URL ảnh cũ từ DB) thì trả về nguyên xi
            return { field, url: fileOrUrl };
        });

        // 2. KÍCH NỔ PROMISE.ALL (Up 4 ảnh song song cùng 1 giây)
        const results = await Promise.all(uploadPromises);

        // 3. GẮN URL MỚI VÀO LẠI PAYLOAD
        results.forEach(({ field, url }) => {
            payload[field] = url;
        });

        return payload as ProductRequest;
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
        mutationFn: async ({ id, data }: { id: number, data: ProductFormData }) => { // 👈 Sửa type data thành ProductFormData ở đây để nó map đúng
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
            toastRef.current?.show({ severity: 'error', summary: 'Lỗi', detail: `Không thể xóa sản phẩm này! ${error.message || error.response?.data?.message || 'Có lỗi xảy ra!'}` });
        }
    });

    return {
        create: createMutation.mutate,
        update: updateMutation.mutate,
        remove: deleteMutation.mutate,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    }
}
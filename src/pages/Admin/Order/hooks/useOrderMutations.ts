import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/api/orderApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { CreateOrderRequest } from "@/@types/order.types";

export const useOrderMutations = (toast: RefObject<Toast>) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateOrderRequest) => orderApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.current?.show({ severity: "success", summary: "Thành công", detail: "Tạo đơn hàng mới thành công!" });
        },
        onError: (error: any) => {
            toast.current?.show({ 
                severity: "error", 
                summary: "Lỗi", 
                detail: error?.response?.data?.message || "Không thể tạo đơn hàng!" 
            });
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: (data: { id: number; status: number }) => orderApi.updateStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error: any) => {
            toast.current?.show({ 
                severity: "error", 
                summary: "Lỗi", 
                detail: error?.response?.data?.message || "Không thể cập nhật trạng thái!" 
            });
        }
    });

    return {
        createOrder: createMutation.mutate,
        isPending: createMutation.isPending,
        updateOrderStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending
    };
};
import { useMutation, Mutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/api/customerApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { UpdateCustomerRequest } from "@/@types/customer.types";

export const useCustomerMutations = (toast: RefObject<Toast>) => {
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: (params: { id: number, data: UpdateCustomerRequest }) => customerApi.update(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.current?.show({ severity: "success", summary: "Thành công", detail: "Cập nhật trạng thái người dùng thành công!", life: 3000 });
        },
        onError: (error: any) => {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: error?.response?.data?.message || "Không thể cập nhật trạng thái!" });
        }
    });
    
    const toggleStatus = (customer: any) => {
        const newStatus = customer.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE";
        updateMutation.mutate({
            id: customer.id,
            data: {
                ...customer,
                status: newStatus
            }
        });
    };
    return {
        update: updateMutation.mutate,
        toggleStatus,
        isPending: updateMutation.isPending
    };
}; 

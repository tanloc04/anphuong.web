import { useMutation, Mutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/userApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { UpdateUserRequest } from "@/@types/user.types";

export const useUserMutations = (toast: RefObject<Toast>) => {
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: (params: { id: number, data: UpdateUserRequest }) => userApi.update(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.current?.show({ severity: "success", summary: "Thành công", detail: "Cập nhật trạng thái người dùng thành công!", life: 3000 });
        },
        onError: (error: any) => {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: error?.response?.data?.message || "Không thể cập nhật trạng thái!" })
        }
    });
    
    const toggleStatus = (user: any) => {
        const newStatus = user.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE";
        updateMutation.mutate({
            id: user.id,
            data: {
                ...user,
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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";

export const useAuthMutations = (toast: RefObject<Toast>) => {
  const queryClient = useQueryClient();

  const blockMutation = useMutation({
    mutationFn: (id: number) => authApi.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã thay đổi trạng thái tài khoản!",
        life: 3000,
      });
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: error?.response?.data?.message || "Lỗi khi khóa tài khoản!",
      });
    },
  });

  const toggleStatus = (id: number) => {
    blockMutation.mutate(id);
  };

  return {
    toggleStatus,
    isTogglePending: blockMutation.isPending,
  };
};

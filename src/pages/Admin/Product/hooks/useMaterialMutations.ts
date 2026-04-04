import { useMutation, useQueryClient } from "@tanstack/react-query";
import { materialApi } from "@/api/materialApi";
import type { CreateMaterialRequest } from "@/@types/material.types";
import type { Toast } from "primereact/toast";
import type { RefObject } from "react";

export const useMaterialMutations = (toast?: RefObject<Toast>) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateMaterialRequest) => materialApi.create(data),
    onSuccess: () => {
      // BÍ KÍP REACT QUERY: Báo cho hệ thống biết data 'materials' đã cũ, tự động gọi API lấy data mới
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      
      toast?.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã thêm chất liệu mới!",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo chất liệu:", error);
      toast?.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể thêm chất liệu mới!",
      });
    },
  });

  return {
    createMaterial: createMutation.mutate,
    isCreatingMaterial: createMutation.isPending,
  };
};
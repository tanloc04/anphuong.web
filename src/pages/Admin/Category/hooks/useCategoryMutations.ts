import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/api/categoryApi";
import { Toast } from "primereact/toast";
import type { RefObject } from "react";
import type { CategoryRequest } from "@/@types/category.types";

export const useCategoryMutations = (toastRef: RefObject<Toast>) => {
  const queryClient = useQueryClient();

  const onSuccess = (message: string) => {
    toastRef.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: message,
    });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const onError = (error: any) => {
    const msg = error.response?.data?.message || "Có lỗi xảy ra";
    toastRef.current?.show({ severity: "error", summary: "Lỗi", detail: msg });
  };

  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => onSuccess("Tạo danh mục thành công!"),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      categoryApi.update(id, data),
    onSuccess: () => onSuccess("Cập nhật thành công!"),
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => onSuccess("Đã xóa danh mục"),
    onError,
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

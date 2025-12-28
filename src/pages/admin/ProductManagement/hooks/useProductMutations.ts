import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "../requests";

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: any) => createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: {id: number; data: any}) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation
  };
};
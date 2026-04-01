import axiosClient from "./axiosClient";

export const cartApi = {
  getCart: () => {
    return axiosClient.get("/Cart");
  },

  addToCart: (payload: {
    productId: number;
    variantId: number | null;
    quantity: number;
  }) => {
    return axiosClient.post("/Cart/add", payload);
  },

  updateQuantity: (cartItemId: number, quantity: number) => {
    return axiosClient.put(`/Cart/update/${cartItemId}`, quantity, {
      headers: { "Content-Type": "application/json" },
    });
  },

  removeItem: (cartItemId: number) => {
    return axiosClient.delete(`/Cart/remove/${cartItemId}`);
  },

  syncCart: (payload: any[]) => {
    return axiosClient.post("/Cart/sync", payload);
  },
};

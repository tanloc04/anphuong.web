import axiosClient from "./axiosClient";

export const paymentApi = {
  createVnPayUrl: (data: {
    orderId: number;
    amount: number;
    orderDescription: string;
  }) => {
    return axiosClient.post("/Payment/create-payment-url", data);
  },
};

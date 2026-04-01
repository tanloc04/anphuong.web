import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { cartApi } from "@/api/cartApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOrderMutations } from "@/pages/Admin/Order/hooks";
import type { CheckoutForm } from "@/@types/order.types";

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);
  const queryClient = useQueryClient();

  const { createOrder, isPending } = useOrderMutations(toastRef);

  const { data: serverCartData } = useQuery({
    queryKey: ["cart-data"],
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data?.data;
    },
    enabled: isAuthenticated,
  });

  const rawCartItems = isAuthenticated
    ? serverCartData?.cartItems || []
    : JSON.parse(localStorage.getItem("cart") || "[]");

  const cartItems = Array.isArray(rawCartItems) ? rawCartItems : [];

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = cartItems.length > 0 ? 50000 : 0;
  const total = subTotal + shippingFee;

  const { control, handleSubmit, setValue } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      note: "",
      paymentMethod: "COD",
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("fullName", user.username || "");
      setValue("email", user.email || "");
    }
  }, [isAuthenticated, user, setValue]);

  const onSubmit = (data: CheckoutForm) => {
    if (cartItems.length === 0) {
      toastRef.current?.show({ severity: "warn", detail: "Giỏ hàng trống!" });
      return;
    }

    const orderPayload: any = {
      receiverName: data.fullName,
      receiverPhone: data.phone,
      shippingAddress: data.address,
      paymentMethod: data.paymentMethod === "COD" ? 0 : 1,
      note: data.note,
      totalPrice: total,
      status: 1,
      shippingDate: new Date(
        new Date().setDate(new Date().getDate() + 3),
      ).toISOString(),
      customerId: user?.id || null,
      orderDetails: cartItems.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
        subTotal: item.price * item.quantity,
      })),
    };

    createOrder(orderPayload, {
      onSuccess: () => {
        if (isAuthenticated) {
          queryClient.invalidateQueries({ queryKey: ["cart-data"] });
        } else {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("localCartUpdated"));
        }

        setTimeout(() => {
          navigate("/order-success");
        }, 1500);
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 pt-24">
        <i className="pi pi-shopping-bag text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Button
          label="Quay lại mua sắm"
          onClick={() => navigate("/pages/product")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 pt-24">
      <Toast ref={toastRef} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thanh Toán</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-8"
      >
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Vui lòng nhập họ tên" }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        {...field}
                        className={`p-3 ${fieldState.invalid ? "p-invalid" : ""}`}
                      />
                      {fieldState.error && (
                        <small className="text-red-500">
                          {fieldState.error.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        {...field}
                        className={`p-3 ${fieldState.invalid ? "p-invalid" : ""}`}
                      />
                      {fieldState.error && (
                        <small className="text-red-500">
                          {fieldState.error.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Email (Để nhận hóa đơn)
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      type="email"
                      className="p-3"
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Địa chỉ cụ thể (Số nhà, Tên đường, Phường/Xã, Quận/Huyện,
                  Tỉnh/Thành phố) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Vui lòng nhập địa chỉ giao hàng" }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        id={field.name}
                        {...field}
                        rows={3}
                        className={`p-3 ${fieldState.invalid ? "p-invalid" : ""}`}
                      />
                      {fieldState.error && (
                        <small className="text-red-500">
                          {fieldState.error.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Ghi chú đơn hàng
                </label>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={2}
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      className="p-3"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Phương thức thanh toán
            </h2>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <RadioButton
                      inputId="cod"
                      {...field}
                      inputRef={field.ref}
                      value="COD"
                      checked={field.value === "COD"}
                    />
                    <label
                      htmlFor="cod"
                      className="ml-2 flex-1 cursor-pointer font-medium text-gray-700 flex items-center gap-2"
                    >
                      <i className="pi pi-money-bill text-green-500 text-xl"></i>{" "}
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <RadioButton
                      inputId="vnpay"
                      {...field}
                      inputRef={field.ref}
                      value="VNPAY"
                      checked={field.value === "VNPAY"}
                    />
                    <label
                      htmlFor="vnpay"
                      className="ml-2 flex-1 cursor-pointer font-medium text-gray-700 flex items-center gap-2"
                    >
                      <img
                        src="/vnpay-logo.png"
                        alt="VNPay"
                        className="h-5 object-contain"
                      />
                      Thanh toán qua VNPAY
                    </label>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Đơn hàng của bạn
            </h2>

            <div className="max-h-60 overflow-y-auto mb-4 pr-2 pt-3 space-y-4 custom-scrollbar">
              {cartItems.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="relative">
                    <img
                      src={
                        item.productImage ||
                        item.image ||
                        "https://via.placeholder.com/50"
                      }
                      alt="SP"
                      className="w-14 h-14 object-cover rounded border"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-gray-800 line-clamp-1">
                      {item.productName || item.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {item.variantDisplay || item.variant || ""}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <div className="space-y-3 text-gray-600 mt-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(subTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(shippingFee)}
                </span>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-red-500">
                {formatCurrency(total)}
              </span>
            </div>

            <Button
              type="submit"
              label="ĐẶT HÀNG"
              loading={isPending}
              className="w-full h-12 text-lg font-bold !bg-[#c4a484] !border-none hover:!bg-[#a88b6e]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

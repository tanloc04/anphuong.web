import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";

// 1. DUMMY DATA: Giả lập dữ liệu giỏ hàng ban đầu
const DUMMY_CART_ITEMS = [
  {
    id: 1,
    productId: 101,
    name: "Bàn Console Phong Cách Bắc Âu",
    variant: "Màu Đen - Gỗ Liêm",
    price: 3000000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=200&h=200",
    stock: 5, // Tồn kho tối đa để giới hạn input
  },
  {
    id: 2,
    productId: 102,
    name: "Ghế Sofa Đơn Thư Giãn",
    variant: "Màu Xám - Vải Nỉ",
    price: 1500000,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=200&h=200",
    stock: 10,
  },
];

const CartManagement = () => {
  const [cartItems, setCartItems] = useState(DUMMY_CART_ITEMS);
  const [couponCode, setCouponCode] = useState("");

  // 2. LOGIC XỬ LÝ: Tăng/Giảm số lượng
  const handleQuantityChange = (id: number, newQuantity: number | null) => {
    if (!newQuantity || newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // 3. LOGIC XỬ LÝ: Xóa sản phẩm khỏi giỏ
  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 4. TÍNH TOÁN TỔNG TIỀN
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = cartItems.length > 0 ? 50000 : 0; // Giả lập phí ship 50k
  const total = subTotal + shippingFee;

  // Format tiền tệ VNĐ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i className="pi pi-shopping-cart text-2xl text-blue-600"></i>
        Giỏ Hàng Của Bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ================= BÊN TRÁI: DANH SÁCH SẢN PHẨM ================= */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Cột */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-3 text-right">Tạm tính</div>
            </div>

            {/* Danh sách Item */}
            {cartItems.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Hình ảnh + Thông tin */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-bold text-gray-800 text-base md:text-lg line-clamp-2">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                          {item.variant}
                        </span>
                        <div className="text-blue-600 font-semibold mt-2 md:hidden">
                          {formatCurrency(item.price)}
                        </div>
                        <Button
                          label="Xóa"
                          icon="pi pi-trash"
                          className="p-0 text-red-500 mt-2 w-fit text-sm hover:underline"
                          text
                          onClick={() => handleRemoveItem(item.id)}
                        />
                      </div>
                    </div>

                    {/* Chọn số lượng */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center">
                      <InputNumber
                        value={item.quantity}
                        onValueChange={(e) =>
                          handleQuantityChange(item.id, e.value ?? null)
                        }
                        showButtons
                        buttonLayout="horizontal"
                        step={1}
                        min={1}
                        max={item.stock}
                        decrementButtonClassName="p-button-secondary p-button-outlined h-8"
                        incrementButtonClassName="p-button-secondary p-button-outlined h-8"
                        incrementButtonIcon="pi pi-plus text-xs"
                        decrementButtonIcon="pi pi-minus text-xs"
                        inputClassName="w-12 text-center h-8 font-semibold"
                        className="shadow-sm"
                      />
                    </div>

                    {/* Tổng tiền của Item */}
                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center font-bold text-gray-800 text-lg">
                      <span className="md:hidden text-gray-500 font-normal text-sm">
                        Thành tiền:
                      </span>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <i className="pi pi-shopping-bag text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-400 mb-6">
                  Chưa có sản phẩm nào trong giỏ hàng của bạn.
                </p>
                <Button
                  label="Tiếp tục mua sắm"
                  icon="pi pi-arrow-left"
                  severity="info"
                  outlined
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= BÊN PHẢI: TÓM TẮT ĐƠN HÀNG ================= */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 text-gray-600">
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

            {/* Mã giảm giá */}
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-600 mb-2 block">
                Mã giảm giá
              </span>
              <div className="p-inputgroup">
                <InputText
                  placeholder="Nhập mã..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full"
                />
                <Button label="Áp dụng" severity="secondary" className="px-4" />
              </div>
            </div>

            <Button
              label="Tiến Hành Thanh Toán"
              icon="pi pi-check-circle"
              className="w-full h-12 text-lg font-bold"
              size="large"
              disabled={cartItems.length === 0}
            />

            <p className="text-xs text-center text-gray-400 mt-4">
              Bằng việc tiến hành thanh toán, bạn đồng ý với Điều khoản dịch vụ
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartManagement;

import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { cartApi } from "@/api/cartApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CartManagement = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const toastRef = useRef<Toast>(null);

  const navigate = useNavigate();

  const [localCartItems, setLocalCartItems] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState("");

  // LUỒNG API (Khách đã đăng nhập)
  const { data: serverCartData, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cart-data"],
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data?.data; // 👈 FIX: Trả về nguyên cục Data giống hệt bên Header
    },
    enabled: isAuthenticated,
  });

  // LUỒNG LOCAL STORAGE (Khách vãng lai)
  useEffect(() => {
    if (!isAuthenticated) {
      const loadLocalCart = () => {
        const localStr = localStorage.getItem("cart");
        if (localStr) {
          try {
            const parsed = JSON.parse(localStr);
            setLocalCartItems(Array.isArray(parsed) ? parsed : []); // Ép kiểu cho an toàn
          } catch (e) {
            setLocalCartItems([]);
          }
        } else {
          setLocalCartItems([]);
        }
      };

      loadLocalCart();
      window.addEventListener("localCartUpdated", loadLocalCart);
      window.addEventListener("storage", loadLocalCart);

      return () => {
        window.removeEventListener("localCartUpdated", loadLocalCart);
        window.removeEventListener("storage", loadLocalCart);
      };
    }
  }, [isAuthenticated]);

  // 👉 CHỐT DỮ LIỆU HIỂN THỊ
  // Bóc cái mảng cartItems từ cục serverCartData ra
  const rawCartItems = isAuthenticated
    ? serverCartData?.cartItems || []
    : localCartItems;

  // 🛡️ LỚP BẢO HIỂM: Đảm bảo 100% nó phải là Array thì hàm MAP và REDUCE ở dưới mới không chết
  const cartItems = Array.isArray(rawCartItems) ? rawCartItems : [];

  // ====================================================================
  // 🛒 2. XỬ LÝ TĂNG/GIẢM SỐ LƯỢNG
  // ====================================================================
  const handleQuantityChange = async (
    item: any,
    newQuantity: number | null,
  ) => {
    if (!newQuantity || newQuantity < 1) return;

    if (isAuthenticated) {
      try {
        await cartApi.updateQuantity(item.id, newQuantity);
        queryClient.invalidateQueries({ queryKey: ["cart-data"] });
      } catch (error) {
        toastRef.current?.show({
          severity: "error",
          detail: "Lỗi cập nhật số lượng!",
        });
      }
    } else {
      const updatedCart = localCartItems.map((c) =>
        c.productId === item.productId && c.variantId === item.variantId
          ? { ...c, quantity: newQuantity }
          : c,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setLocalCartItems(updatedCart);
      window.dispatchEvent(new Event("localCartUpdated"));
    }
  };

  // ====================================================================
  // 🛒 3. XỬ LÝ XÓA SẢN PHẨM
  // ====================================================================
  const handleRemoveItem = async (item: any) => {
    if (isAuthenticated) {
      try {
        await cartApi.removeItem(item.id);
        queryClient.invalidateQueries({ queryKey: ["cart-data"] });
        toastRef.current?.show({
          severity: "success",
          detail: "Đã xóa khỏi giỏ hàng!",
        });
      } catch (error) {
        toastRef.current?.show({
          severity: "error",
          detail: "Lỗi khi xóa sản phẩm!",
        });
      }
    } else {
      const updatedCart = localCartItems.filter(
        (c) =>
          !(c.productId === item.productId && c.variantId === item.variantId),
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setLocalCartItems(updatedCart);
      window.dispatchEvent(new Event("localCartUpdated"));
      toastRef.current?.show({
        severity: "success",
        detail: "Đã xóa khỏi giỏ hàng!",
      });
    }
  };

  // ====================================================================
  // 🛒 4. TÍNH TOÁN TỔNG TIỀN
  // ====================================================================
  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );
  //const shippingFee = cartItems.length > 0 ? 50000 : 0;
  const total = subTotal;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (isAuthenticated && isLoadingCart) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 pt-24">
      <Toast ref={toastRef} />
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
                {cartItems.map((item: any, index: number) => (
                  <div
                    key={isAuthenticated ? item.id : index} // Guest ko có ID từ DB nên dùng index
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Hình ảnh + Thông tin */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <img
                        src={
                          item.productImage ||
                          item.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.productName || item.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-bold text-gray-800 text-base md:text-lg line-clamp-2">
                          {item.productName || item.name}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                          {item.variantDisplay || item.variant || "Mặc định"}
                        </span>
                        <div className="text-blue-600 font-semibold mt-2 md:hidden">
                          {formatCurrency(item.price)}
                        </div>
                        <Button
                          label="Xóa"
                          icon="pi pi-trash"
                          className="p-0 text-red-500 mt-2 w-fit text-sm hover:underline"
                          text
                          onClick={() => handleRemoveItem(item)}
                        />
                      </div>
                    </div>

                    {/* Chọn số lượng */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center">
                      <InputNumber
                        value={item.quantity}
                        onValueChange={(e) =>
                          handleQuantityChange(item, e.value ?? null)
                        }
                        showButtons
                        buttonLayout="horizontal"
                        step={1}
                        min={1}
                        max={item.maxStock || item.stock || 999}
                        decrementButtonClassName="p-button-secondary p-button-outlined h-8"
                        incrementButtonClassName="p-button-secondary p-button-outlined h-8"
                        incrementButtonIcon="pi pi-plus text-xs"
                        decrementButtonIcon="pi pi-minus text-xs"
                        inputClassName="w-12 text-center h-8 font-semibold"
                        className="shadow-sm"
                      />
                    </div>

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
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <i className="pi pi-shopping-bag text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-400 mb-6">
                  Chưa có sản phẩm nào trong giỏ hàng của bạn.
                </p>
                <Link to="/pages/product">
                  <Button
                    label="Tiếp tục mua sắm"
                    icon="pi pi-arrow-left"
                    severity="info"
                    outlined
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
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
                <span className="text-sm italic text-gray-500">
                  Được tính ở bước thanh toán
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
              onClick={() => navigate("/checkout")}
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

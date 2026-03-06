import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";

import type { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import type { OrderFormProps } from "@/@types/order.types";
import type {
  Customer,
  Product,
  Variant,
  CartItem,
} from "@/@types/common.types";
import {
  useCustomersSelect,
  useProductSelect,
  useVariantByProduct,
} from "../hooks/useOrderReference";
import type { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const OrderForm = ({ visible, onHide, onSave, loading }: OrderFormProps) => {
  const [customerFilter, setCustomerFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | any>(
    null,
  );

  // 🚀 Hook tự động gọi lại mỗi khi customerFilter thay đổi
  const { data: customers, isLoading: loadCust } =
    useCustomersSelect(customerFilter);

  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Ép tạo ra một mảng mới trong RAM để PrimeReact nhận diện được sự thay đổi và tắt Loading
    if (customers) {
      setCustomerSuggestions([...customers]);
    } else {
      setCustomerSuggestions([]);
    }
  }, [customers]);

  const [productFilter, setProductFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | any>(null);
  const [quantity, setQuantity] = useState(1);

  const toast = useRef<Toast | null>(null);

  const { data: products, isLoading: loadPro } =
    useProductSelect(productFilter);
  const { data: variants, isLoading: loadVar } = useVariantByProduct(
    selectedProduct?.id ?? null,
  );

  const [cartItems, setCartItems] = useState<CartItem[] | any[]>([]);

  // 👇 HÀM TÌM KIẾM KHÁCH HÀNG (Gọi khi gõ phím)
  const searchCustomer = (event: AutoCompleteCompleteEvent) => {
    // PrimeReact tự động debounce, ta chỉ việc set state để Hook gọi API mới
    setCustomerFilter(event.query);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedProduct) return;

    const existItemIndex = cartItems.findIndex(
      (x) => x.variantId === selectedVariant.id,
    );

    // 🚀 LẤY CẢ MÀU VÀ CHẤT LIỆU
    const colorName = selectedVariant.color?.name || "N/A";
    const materialName = selectedVariant.material?.name || "N/A";
    const fullVariantName = `${colorName} - ${materialName}`;

    if (existItemIndex !== -1) {
      const newCart = [...cartItems];
      newCart[existItemIndex].quantity += quantity;
      newCart[existItemIndex].total =
        newCart[existItemIndex].quantity * newCart[existItemIndex].price;
      setCartItems(newCart);
    } else {
      const newItem = {
        variantId: selectedVariant.id,
        productName: selectedProduct.name,
        colorName: fullVariantName, // Cập nhật tên hiển thị ở đây
        image: selectedVariant.variantImage,
        price: selectedVariant.price ?? selectedProduct.price, // Ưu tiên giá của biến thể, nếu không có lấy giá gốc
        quantity: quantity,
        total: (selectedVariant.price ?? selectedProduct.price) * quantity,
      };
      setCartItems([...cartItems, newItem]);
    }

    setSelectedVariant(null);
    setQuantity(1);
  };

  const removeFromCart = (variantId: any) => {
    setCartItems(cartItems.filter((x) => x.variantId !== variantId));
  };

  const totalOrderPrice = cartItems.reduce((acc, item) => acc + item.total, 0);

  const handleSaveOrder = () => {
    // ⚠️ Kiểm tra nếu selectedCustomer chỉ là string (người dùng gõ text nhưng chưa bấm chọn item)
    if (!selectedCustomer || typeof selectedCustomer === "string") {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng chọn khách hàng từ danh sách gợi ý.",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Giỏ hàng đang trống.",
      });
      return;
    }

    const payload = {
      customerId: selectedCustomer.id,
      paymentMethod: 0,
      totalPrice: totalOrderPrice,
      orderDetails: cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    onSave(payload);
  };

  // 👇 GIAO DIỆN GỢI Ý KHÁCH HÀNG TÌM ĐƯỢC
  const customerItemTemplate = (item: any) => {
    const displayName =
      item.fullName ||
      item.FullName ||
      item.name ||
      item.username ||
      item.email ||
      "Khách hàng ẩn danh";
    const displayPhone =
      item.phoneNumber || item.phone || item.Phone || "Không có SĐT";
    return (
      <div className="flex align-items-center gap-3 py-1">
        <div
          className="bg-blue-100 text-blue-600 border-circle flex align-items-center justify-content-center"
          style={{ width: "32px", height: "32px" }}
        >
          <i className="pi pi-user"></i>
        </div>
        <div>
          <div className="font-bold text-gray-800">{displayName}</div>
          <div className="text-xs text-gray-500 mt-1">
            <i className="pi pi-phone text-xs mr-1"></i>
            {displayPhone}
          </div>
        </div>
      </div>
    );
  };

  // 👇 GIAO DIỆN DROPDOWN BIẾN THỂ (Thêm Chất liệu)
  const variantOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center gap-2">
        {option.variantImage && (
          <img
            src={option.variantImage}
            alt="img"
            style={{
              width: "24px",
              height: "24px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        )}
        <div
          style={{
            width: "16px",
            height: "16px",
            background: option.color?.hexCode,
            border: "1px solid #ccc",
            borderRadius: "50%",
          }}
        ></div>
        <span className="font-semibold">{option.color?.name}</span>
        <span className="text-gray-400 mx-1">|</span>
        <span className="text-gray-600">
          {option.material?.name || "Chưa rõ"}
        </span>
        <span className="text-green-600 font-bold ml-auto text-sm">
          {option.price?.toLocaleString("vi-VN")} ₫
        </span>
      </div>
    );
  };

  return (
    <Dialog
      header="Tạo mới đơn hàng"
      visible={visible}
      style={{ width: "1000px", maxWidth: "95vw" }}
      onHide={onHide}
      maximized
    >
      <div className="grid">
        <div className="col-12 md:col-4 border-right-1 surface-border">
          <div className="mb-4">
            <label className="font-bold block mb-2">
              1. Khách hàng <span className="text-red-500">*</span>
            </label>
            <AutoComplete
              value={selectedCustomer}
              suggestions={customerSuggestions}
              completeMethod={searchCustomer}
              field="fullName"
              itemTemplate={customerItemTemplate}
              onChange={(e) => setSelectedCustomer(e.value)}
              placeholder="Nhập tên hoặc số điện thoại..."
              className="w-full"
              inputClassName="w-full"
              panelClassName="shadow-3"
              emptyMessage="Không tìm thấy khách hàng nào"
              dropdown // Hiện nút bấm mũi tên sổ xuống như Dropdown
            />
          </div>

          <hr className="my-3 surface-border" />
          <div className="mb-3">
            <label className="font-bold block mb-2">2. Chọn sản phẩm</label>
            <Dropdown
              value={selectedProduct}
              options={products}
              onChange={(e) => {
                setSelectedProduct(e.value);
                setSelectedVariant(null);
              }}
              optionLabel="name"
              filter
              onFilter={(e) => setProductFilter(e.filter)}
              placeholder="Gõ tên sản phẩm..."
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="font-bold block mb-2">
              3. Chọn phiên bản (Màu & Chất liệu)
            </label>
            <Dropdown
              value={selectedVariant}
              options={variants}
              onChange={(e) => setSelectedVariant(e.value)}
              optionLabel="color.name"
              itemTemplate={variantOptionTemplate}
              // Hiển thị sau khi chọn cũng đầy đủ Màu + Chất liệu
              valueTemplate={(val) => {
                if (!val)
                  return (
                    <span className="text-gray-500">
                      Chọn màu và chất liệu...
                    </span>
                  );
                return (
                  <div className="flex align-items-center gap-2">
                    <span className="font-bold">{val.color?.name}</span>
                    <span>-</span>
                    <span>{val.material?.name}</span>
                  </div>
                );
              }}
              placeholder={
                selectedProduct
                  ? "Chọn màu sắc và chất liệu..."
                  : "Vui lòng chọn sản phẩm trước"
              }
              className="w-full"
              disabled={!selectedProduct}
              loading={loadVar}
              emptyMessage="Sản phẩm này chưa có biến thể nào"
            />
          </div>

          <div className="flex gap-2">
            <InputNumber
              value={quantity}
              onValueChange={(e) => setQuantity(e.value || 1)}
              showButtons
              min={1}
              placeholder="SL"
              className="w-4rem"
            />

            <Button
              label="Thêm vào đơn"
              icon="pi pi-plus"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            />
          </div>
        </div>

        <div className="col-12 md:col-8 pl-4">
          <h5 className="m-0 mb-3 font-bold text-gray-700">
            Chi tiết đơn hàng
          </h5>

          <DataTable
            value={cartItems}
            scrollable
            scrollHeight="400px"
            size="small"
            stripedRows
            emptyMessage="Chưa có sản phẩm nào được chọn."
          >
            <Column
              header="#"
              body={(d, opt) => opt.rowIndex + 1}
              style={{ width: "30px" }}
            />
            <Column
              header="Sản phẩm"
              body={(row) => (
                <div className="flex align-items-center gap-2">
                  <img
                    src={row.image || "/placeholder.png"}
                    alt="img"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <div className="font-bold text-sm">{row.productName}</div>
                    {/* Tên Màu & Chất liệu hiển thị ở đây */}
                    <div className="text-xs font-semibold text-purple-600">
                      {row.colorName}
                    </div>
                  </div>
                </div>
              )}
            />

            <Column
              field="quantity"
              header="SL"
              align="center"
              style={{ width: "60px" }}
            />

            <Column
              header="Đơn giá"
              body={(row) => row.price?.toLocaleString("vi-VN")}
              align="center"
              style={{ width: "100px" }}
            />

            <Column
              header="Thành tiền"
              body={(row) => row.total?.toLocaleString("vi-VN")}
              align="right"
              style={{ width: "120px" }}
              className="font-bold text-green-600"
            />

            <Column
              body={(row) => (
                <Button
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  onClick={() => removeFromCart(row.variantId)}
                />
              )}
              style={{ width: "50px" }}
            />
          </DataTable>

          <div className="flex justify-content-end align-items-center mt-4 pt-3 border-top-1 surface-border">
            <span className="text-xl mr-3 text-gray-600">Tổng cộng:</span>
            <span className="text-2xl font-bold text-primary">
              {totalOrderPrice.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <div className="flex justify-content-end gap-2 mt-5">
            <Button
              label="Hủy bỏ"
              icon="pi pi-times"
              severity="secondary"
              text
              onClick={onHide}
            />
            <Button
              label="Lưu Đơn Hàng"
              icon="pi pi-check"
              onClick={handleSaveOrder}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderForm;

import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const { data: customers, isLoading: loadCust } =
    useCustomersSelect(customerFilter);

  const [productFilter, setProductFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const toast = useRef<Toast | null>(null);

  const { data: products, isLoading: loadPro } =
    useProductSelect(productFilter);
  const { data: variants, isLoading: loadVar } = useVariantByProduct(
    selectedProduct?.id ?? null,
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedProduct) return;

    const existItemIndex = cartItems.findIndex(
      (x) => x.variantId === selectedVariant.id,
    );

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
        colorName: selectedVariant.color?.name,
        image: selectedVariant.variantImage,
        price: selectedProduct.price,
        quantity: quantity,
        total: selectedProduct.price * quantity,
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
    if (!selectedCustomer) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng chọn khách hàng.",
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

  const variantOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center gap-2">
        {option.variantImage && (
          <img
            src={option.variantImage}
            alt="img"
            style={{ width: "20px", height: "20px", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            width: "15px",
            height: "15px",
            background: option.color?.hexCode,
            border: "1px solid #ccc",
          }}
        ></div>
        <span>{option.color?.name}</span>
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
            <label className="font-bold block mb-2">1. Khách hàng</label>
            <Dropdown
              value={selectedCustomer}
              options={customers}
              onChange={(e) => setSelectedCustomer(e.value)}
              optionLabel="fullName"
              filter
              onFilter={(e) => setCustomerFilter(e.filter)}
              placeholder="Tìm khách hàng..."
              className="w-full"
              emptyMessage="Không tìm thấy"
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
              3. Chọn phiên bản (Màu)
            </label>
            <Dropdown
              value={selectedVariant}
              options={variants}
              onChange={(e) => setSelectedVariant(e.value)}
              optionLabel="color.name"
              itemTemplate={variantOptionTemplate}
              placeholder={
                selectedProduct
                  ? "Chọn màu sắc..."
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
                    <div className="text-xs text-gray-500">{row.colorName}</div>
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
              body={(row) => row.price?.toLocaleString()}
              align="center"
              style={{ width: "100px" }}
            />

            <Column
              header="Thành tiền"
              body={(row) => row.total?.toLocaleString()}
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
              {totalOrderPrice.toLocaleString()} đ
            </span>
          </div>

          <div className="flex justify-content-end gap-2 mt-5">
            <Button
              label="Hủy bỏ"
              icon="pi pi-times"
              severity="secondary"
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

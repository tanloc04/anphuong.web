import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import type { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
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
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { locationApi } from "@/api/locationApi";

// Ghi đè Type để cho phép truyền callback báo kết quả ra ngoài
interface LocalOrderFormProps extends Omit<OrderFormProps, "onSave"> {
  onSave: (
    payload: any,
    onSuccess: () => void,
    onError: (err: any) => void,
  ) => void;
}

const OrderForm = ({
  visible,
  onHide,
  onSave,
  loading,
}: LocalOrderFormProps) => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [customerFilter, setCustomerFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | any>(
    null,
  );
  const { data: customers } = useCustomersSelect(customerFilter);
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);

  const [newCustomerInfo, setNewCustomerInfo] = useState({
    fullName: "",
    phone: "",
  });

  const [orderInfo, setOrderInfo] = useState({
    deliveryDate: null as Date | null,
    paymentMethod: 0,
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [streetAddress, setStreetAddress] = useState("");

  const [productFilter, setProductFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | any>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const [isCustomized, setIsCustomized] = useState(false);
  const [customSizes, setCustomSizes] = useState({
    height: null as number | null,
    width: null as number | null,
    long: null as number | null,
  });

  const toast = useRef<Toast | null>(null);
  const { data: products } = useProductSelect(productFilter);
  const { data: variants, isLoading: loadVar } = useVariantByProduct(
    selectedProduct?.id ?? null,
  );

  React.useEffect(() => {
    if (customers) {
      setCustomerSuggestions([...customers]);
    } else {
      setCustomerSuggestions([]);
    }
  }, [customers]);

  React.useEffect(() => {
    locationApi
      .getAllProvinces()
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Lỗi tải tỉnh thành", err));
  }, []);

  React.useEffect(() => {
    if (selectedProvince) {
      locationApi.getDistrictsByProvince(selectedProvince.code).then((data) => {
        setDistricts(data);
        setSelectedDistrict(null);
        setWards([]);
        setSelectedWard(null);
      });
    }
  }, [selectedProvince]);

  React.useEffect(() => {
    if (selectedDistrict) {
      locationApi.getWardsByDistrict(selectedDistrict.code).then((data) => {
        setWards(data);
        setSelectedWard(null);
      });
    }
  }, [selectedDistrict]);

  const searchCustomer = (event: AutoCompleteCompleteEvent) => {
    setCustomerFilter(event.query);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedProduct) return;

    if (
      isCustomized &&
      (!customSizes.long || !customSizes.width || !customSizes.height)
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng nhập đầy đủ Dài, Rộng, Cao cho sản phẩm Customize.",
      });
      return;
    }

    const availableStock =
      selectedVariant.quantityInStock ?? selectedVariant.stock ?? 0;

    const colorName = selectedVariant.color?.name || "N/A";
    const materialName = selectedVariant.material?.name || "N/A";
    const fullVariantName = `${colorName} - ${materialName}`;

    const existItemIndex = cartItems.findIndex(
      (x) =>
        x.variantId === selectedVariant.id && !x.isCustomize && !isCustomized,
    );

    const currentCartQty =
      existItemIndex !== -1 ? cartItems[existItemIndex].quantity : 0;

    if (!isCustomized && currentCartQty + quantity > availableStock) {
      toast.current?.show({
        severity: "error",
        summary: "Không đủ hàng",
        detail: `Sản phẩm này chỉ còn ${availableStock - currentCartQty} cái trong kho!`,
      });
      return;
    }
    if (existItemIndex !== -1 && !isCustomized) {
      const newCart = [...cartItems];
      newCart[existItemIndex].quantity += quantity;
      newCart[existItemIndex].total =
        newCart[existItemIndex].quantity * newCart[existItemIndex].price;
      setCartItems(newCart);
    } else {
      const newItem = {
        cartItemId: Date.now() + Math.random(),
        variantId: selectedVariant.id,
        productName: selectedProduct.name,
        colorName: fullVariantName,
        image: selectedVariant.variantImage,
        price: selectedVariant.price ?? selectedProduct.price,
        quantity: quantity,
        total: (selectedVariant.price ?? selectedProduct.price) * quantity,
        isCustomize: isCustomized,
        customizeHeight: isCustomized ? customSizes.height : null,
        customizeWidth: isCustomized ? customSizes.width : null,
        customizeLong: isCustomized ? customSizes.long : null,
      };
      setCartItems([...cartItems, newItem]);
    }

    setSelectedVariant(null);
    setQuantity(1);
    setIsCustomized(false);
    setCustomSizes({ height: null, width: null, long: null });
  };

  const removeFromCart = (cartItemId: any) => {
    setCartItems(cartItems.filter((x) => x.cartItemId !== cartItemId));
  };

  const totalOrderPrice = cartItems.reduce((acc, item) => acc + item.total, 0);

  const handleSaveOrder = () => {
    if (
      !isNewCustomer &&
      (!selectedCustomer || typeof selectedCustomer === "string")
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng chọn khách hàng.",
      });
      return;
    }
    if (
      isNewCustomer &&
      (!newCustomerInfo.fullName || !newCustomerInfo.phone)
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng nhập tên và SĐT khách mới.",
      });
      return;
    }

    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !streetAddress.trim()
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Chú ý!",
        detail: "Vui lòng điền đầy đủ địa chỉ giao hàng.",
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

    const fullShippingAddress = `${streetAddress.trim()}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;

    const payload = {
      isNewCustomer: isNewCustomer,
      customerId: !isNewCustomer ? selectedCustomer.id : null,
      customerName: isNewCustomer ? newCustomerInfo.fullName : null,
      customerPhone: isNewCustomer ? newCustomerInfo.phone : null,
      shippingAddress: fullShippingAddress,
      deliveryDate: orderInfo.deliveryDate,
      paymentMethod: orderInfo.paymentMethod,
      totalPrice: totalOrderPrice,
      orderDetails: cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
        isCustomize: item.isCustomize,
        customizeHeight: item.customizeHeight,
        customizeWidth: item.customizeWidth,
        customizeLong: item.customizeLong,
      })),
    };

    // Truyền callback thông báo về cho OrderManagement
    onSave(
      payload,
      // Callback OnSuccess
      () => {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đã tạo đơn hàng mới thành công!",
        });
        // Có thể reset form ở đây nếu muốn
        setCartItems([]);
      },
      // Callback OnError
      (error: any) => {
        toast.current?.show({
          severity: "error",
          summary: "Tạo đơn thất bại",
          detail:
            error?.response?.data?.message ||
            "Có lỗi xảy ra. Sản phẩm có thể đã hết hàng!",
        });
      },
    );
  };

  const customerItemTemplate = (item: any) => {
    const displayName =
      item.fullName ||
      item.FullName ||
      item.fullname ||
      item.username ||
      item.email ||
      "Khách hàng ẩn danh";
    const displayPhone =
      item.phoneNumber || item.phone || item.Phone || "Không có SĐT";
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="bg-blue-100 text-blue-600 rounded-full flex items-center justify-center w-8 h-8">
          <i className="pi pi-user text-sm"></i>
        </div>
        <div>
          <div className="font-bold text-gray-800 text-sm">{displayName}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            <i className="pi pi-phone text-[10px] mr-1"></i>
            {displayPhone}
          </div>
        </div>
      </div>
    );
  };

  const variantOptionTemplate = (option: any) => {
    const stock = option.quantityInStock ?? option.stock ?? 0;
    const isOutOfStock = stock <= 0;

    return (
      <div className="flex items-center gap-2">
        {option.variantImage && (
          <img
            src={option.variantImage}
            alt="img"
            className="w-6 h-6 object-cover rounded"
          />
        )}
        <div
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ background: option.color?.hexCode }}
        ></div>
        <span className="font-semibold text-sm">{option.color?.name}</span>
        <span className="text-gray-300 mx-1">|</span>
        <span className="text-gray-600 text-sm">
          {option.material?.name || "Chưa rõ"}
        </span>
        <span
          className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
        >
          Tồn: {stock}
        </span>
        <span className="text-green-600 font-bold ml-auto text-sm">
          {option.price?.toLocaleString("vi-VN")} ₫
        </span>
      </div>
    );
  };

  const dialogFooter = (
    <div className="flex justify-end gap-2 pt-3">
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        severity="secondary"
        text
        onClick={onHide}
        className="px-4"
      />
      <Button
        label="Lưu Đơn Hàng"
        icon="pi pi-check"
        onClick={handleSaveOrder}
        loading={loading}
        className="px-6"
      />
    </div>
  );

  return (
    <Dialog
      header={
        <span className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <i className="pi pi-receipt text-blue-600 text-xl"></i> Tạo mới đơn
          hàng
        </span>
      }
      visible={visible}
      style={{ width: "1100px", maxWidth: "95vw" }}
      onHide={onHide}
      footer={dialogFooter}
      className="p-fluid"
      contentClassName="pb-2"
    >
      <Toast ref={toast} />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 h-[65vh]">
        <div className="w-full lg:w-[420px] shrink-0 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h3 className="text-base font-bold text-gray-700 m-0">
                1. Thông tin khách hàng
              </h3>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center">
                <RadioButton
                  inputId="oldCus"
                  name="cusType"
                  value={false}
                  onChange={(e) => setIsNewCustomer(e.value)}
                  checked={!isNewCustomer}
                />
                <label
                  htmlFor="oldCus"
                  className="ml-2 text-sm font-semibold cursor-pointer"
                >
                  Khách cũ
                </label>
              </div>
              <div className="flex items-center">
                <RadioButton
                  inputId="newCus"
                  name="cusType"
                  value={true}
                  onChange={(e) => setIsNewCustomer(e.value)}
                  checked={isNewCustomer}
                />
                <label
                  htmlFor="newCus"
                  className="ml-2 text-sm font-semibold cursor-pointer text-blue-600"
                >
                  Khách mới
                </label>
              </div>
            </div>

            {isNewCustomer ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                <InputText
                  placeholder="Họ và tên khách hàng *"
                  value={newCustomerInfo.fullName}
                  onChange={(e) =>
                    setNewCustomerInfo({
                      ...newCustomerInfo,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <InputText
                  placeholder="Số điện thoại *"
                  value={newCustomerInfo.phone}
                  onChange={(e) =>
                    setNewCustomerInfo({
                      ...newCustomerInfo,
                      phone: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <AutoComplete
                  value={selectedCustomer}
                  suggestions={customerSuggestions}
                  completeMethod={searchCustomer}
                  field="fullname"
                  itemTemplate={customerItemTemplate}
                  onChange={(e) => setSelectedCustomer(e.value)}
                  placeholder="Nhập tên hoặc số điện thoại..."
                  className="w-full"
                  inputClassName="w-full"
                  emptyMessage="Không tìm thấy khách hàng nào"
                  dropdown
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-700 mb-3 border-b pb-2">
              2. Thông tin giao hàng
            </h3>
            <div className="flex flex-col gap-3">
              <Dropdown
                value={selectedProvince}
                options={provinces}
                onChange={(e) => setSelectedProvince(e.value)}
                optionLabel="name"
                filter
                placeholder="Chọn Tỉnh/Thành phố *"
                className="w-full"
              />
              <div className="flex gap-3">
                <Dropdown
                  value={selectedDistrict}
                  options={districts}
                  onChange={(e) => setSelectedDistrict(e.value)}
                  optionLabel="name"
                  filter
                  placeholder="Chọn Quận/Huyện *"
                  className="w-1/2"
                  disabled={!selectedProvince}
                />
                <Dropdown
                  value={selectedWard}
                  options={wards}
                  onChange={(e) => setSelectedWard(e.value)}
                  optionLabel="name"
                  filter
                  placeholder="Chọn Phường/Xã *"
                  className="w-1/2"
                  disabled={!selectedDistrict}
                />
              </div>

              <InputText
                placeholder="Số nhà, Tên đường, Tòa nhà... *"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full"
              />

              <Calendar
                placeholder="Ngày giao hàng dự kiến"
                value={orderInfo.deliveryDate}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, deliveryDate: e.value as Date })
                }
                showIcon
                dateFormat="dd/mm/yy"
              />
              <Dropdown
                value={orderInfo.paymentMethod}
                options={[
                  { label: "Tiền mặt khi nhận hàng (COD)", value: 0 },
                  { label: "Chuyển khoản ngân hàng", value: 1 },
                ]}
                onChange={(e) =>
                  setOrderInfo({ ...orderInfo, paymentMethod: e.value })
                }
                placeholder="Phương thức thanh toán"
              />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-700 mb-3 border-b pb-2">
              3. Chọn sản phẩm
            </h3>
            <div className="flex flex-col gap-3">
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
              <Dropdown
                value={selectedVariant}
                options={variants}
                onChange={(e) => setSelectedVariant(e.value)}
                optionLabel="color.name"
                itemTemplate={variantOptionTemplate}
                valueTemplate={(val) => {
                  if (!val)
                    return (
                      <span className="text-gray-400">
                        Chọn màu và chất liệu...
                      </span>
                    );
                  return (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        {val.color?.name}
                      </span>
                      <span className="text-gray-400">-</span>
                      <span className="text-sm">{val.material?.name}</span>
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

              <div className="flex items-center mt-1">
                <Checkbox
                  inputId="isCustom"
                  checked={isCustomized}
                  onChange={(e) => setIsCustomized(e.checked || false)}
                />
                <label
                  htmlFor="isCustom"
                  className="ml-2 text-sm font-semibold text-orange-600 cursor-pointer"
                >
                  Khách yêu cầu kích thước tùy chỉnh
                </label>
              </div>

              {isCustomized && (
                <div className="flex gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md animate-fade-in">
                  <InputNumber
                    value={customSizes.long}
                    onValueChange={(e) =>
                      setCustomSizes({ ...customSizes, long: e.value ?? null })
                    }
                    placeholder="Dài (cm)"
                    className="w-1/3"
                  />
                  <InputNumber
                    value={customSizes.width}
                    onValueChange={(e) =>
                      setCustomSizes({ ...customSizes, width: e.value ?? null })
                    }
                    placeholder="Rộng (cm)"
                    className="w-1/3"
                  />
                  <InputNumber
                    value={customSizes.height}
                    onValueChange={(e) =>
                      setCustomSizes({
                        ...customSizes,
                        height: e.value ?? null,
                      })
                    }
                    placeholder="Cao (cm)"
                    className="w-1/3"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <InputNumber
                  value={quantity}
                  onValueChange={(e) => setQuantity(e.value ?? 1)}
                  showButtons
                  min={1}
                  placeholder="SL"
                  className="w-24"
                  inputClassName="text-center font-semibold"
                />
                <Button
                  label="Thêm vào giỏ"
                  icon="pi pi-cart-plus"
                  className="flex-1 font-semibold"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700 m-0">
              Chi tiết đơn hàng
            </h3>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              {cartItems.length} Sản phẩm
            </span>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex-1 bg-white flex flex-col">
            <div className="flex-1 overflow-auto">
              <DataTable
                value={cartItems}
                scrollable
                scrollHeight="flex"
                size="small"
                stripedRows
                emptyMessage={
                  <div className="text-center py-8 text-gray-400">
                    <i className="pi pi-box text-4xl mb-2 text-gray-300"></i>
                    <p>Chưa có sản phẩm nào được chọn.</p>
                  </div>
                }
              >
                <Column
                  header="#"
                  body={(d, opt) => (
                    <span className="text-gray-500">{opt.rowIndex + 1}</span>
                  )}
                  style={{ width: "40px", textAlign: "center" }}
                />
                <Column
                  header="Sản phẩm"
                  body={(row) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={row.image || "/placeholder.png"}
                        alt="img"
                        className="w-10 h-10 object-cover rounded border border-gray-100"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-800 line-clamp-1">
                          {row.productName}
                        </span>
                        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 w-fit px-1.5 rounded mt-0.5">
                          {row.colorName}
                        </span>
                        {row.isCustomize && (
                          <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 w-fit px-1.5 rounded mt-0.5">
                            Size: {row.customizeLong}x{row.customizeWidth}x
                            {row.customizeHeight} cm
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                />
                <Column
                  field="quantity"
                  header="SL"
                  align="center"
                  style={{ width: "70px" }}
                  body={(row) => (
                    <span className="font-semibold">{row.quantity}</span>
                  )}
                />
                <Column
                  header="Đơn giá"
                  body={(row) => (
                    <span className="text-gray-600">
                      {row.price?.toLocaleString("vi-VN")}
                    </span>
                  )}
                  align="right"
                  style={{ width: "110px" }}
                />
                <Column
                  header="Thành tiền"
                  body={(row) => row.total?.toLocaleString("vi-VN")}
                  align="right"
                  style={{ width: "130px" }}
                  className="font-bold text-red-500"
                />
                <Column
                  body={(row) => (
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      onClick={() => removeFromCart(row.cartItemId)}
                      className="w-8 h-8 p-0"
                    />
                  )}
                  style={{ width: "50px", textAlign: "center" }}
                />
              </DataTable>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end items-center gap-4 mt-auto">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Tổng thanh toán:
              </span>
              <span className="text-2xl font-black text-blue-600">
                {totalOrderPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderForm;

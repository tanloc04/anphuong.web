import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import type { IOrderFormProps, OrderFormSubmitData } from '@/types/order.types';

/* ===== MOCK DATA ===== */
const customers = [
  { id: 1, fullname: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0909123456' },
  { id: 2, fullname: 'Trần Thị B', email: 'b@gmail.com', phone: '0987654321' },
  { id: 3, fullname: 'Lê Văn C', email: 'c@gmail.com', phone: '0912345678' },
];

const products = [
  { id: 1, name: 'Sản phẩm A', price: 100000 },
  { id: 2, name: 'Sản phẩm B', price: 200000 },
  { id: 3, name: 'Sản phẩm C', price: 300000 },
  { id: 4, name: 'Sản phẩm D', price: 400000 },
];

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Canceled', value: 'Canceled' },
];

const paymentOptions = [
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Cash on Delivery', value: 'Cash on Delivery' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
];

/* ===== TYPES ===== */
interface OrderItemForm {
  productId: number | null;
  quantity: number;
  price: number;
}

interface OrderFormData {
  customerId: number | null;
  paymentMethod: string;
  status: string;
  shippingDate: Date | null;
  totalPrice: number;
}

/* ===== COMPONENT ===== */
const OrderForm = ({
  visible,
  onHide,
  onSave,
  initialData,
  loading = false,
}: IOrderFormProps) => {
  const isEditMode = !!initialData;

  /* ===== FORM ===== */
  const {
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<OrderFormData>({
    defaultValues: {
      customerId: null,
      paymentMethod: '',
      status: 'Pending',
      shippingDate: null,
      totalPrice: 0,
    },
    mode: 'onChange',
  });

  /* ===== ITEMS ===== */
  const [items, setItems] = useState<OrderItemForm[]>([]);

  /* ===== ADD ITEM DIALOG ===== */
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState<OrderItemForm>({
    productId: null,
    quantity: 1,
    price: 0,
  });

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      setValue('customerId', initialData.customerId ?? null);
      setValue('paymentMethod', initialData.paymentMethod ?? '');
      setValue('status', initialData.status ?? 'Pending');
      setValue(
        'shippingDate',
        initialData.shippingDate
          ? new Date(initialData.shippingDate)
          : null
      );

      setItems(
        initialData.orderItems?.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })) ?? []
      );
    } else {
      reset();
      setItems([]);
    }
  }, [visible, initialData, reset, setValue]);

  /* ===== TOTAL ===== */
  const calculatedTotal = useMemo(
    () => items.reduce((s, i) => s + i.quantity * i.price, 0),
    [items]
  );

  useEffect(() => {
    setValue('totalPrice', calculatedTotal);
  }, [calculatedTotal, setValue]);

  /* ===== ITEM HANDLERS ===== */
  const updateItem = (
    index: number,
    field: keyof OrderItemForm,
    value: any
  ) => {
    setItems(prev => {
      const next = [...prev];
      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        next[index] = {
          productId: value,
          quantity: 1,
          price: product?.price ?? 0,
        };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const openAddItemDialog = () => {
    setNewItem({ productId: null, quantity: 1, price: 0 });
    setShowAddItemDialog(true);
  };

  const confirmAddItem = () => {
    if (!newItem.productId) return;
    setItems(prev => [...prev, newItem]);
    setShowAddItemDialog(false);
  };

  /* ===== SUBMIT ===== */
  const onSubmit = (data: OrderFormData) => {
    if (!data.customerId) return;

    const submitData: OrderFormSubmitData = {
      customerId: data.customerId,
      paymentMethod: data.paymentMethod,
      status: data.status,
      shippingDate: data.shippingDate
        ? data.shippingDate.toISOString().split('T')[0]
        : '',
      totalPrice: calculatedTotal,
      orderItems: items.map(i => ({
        productId: i.productId!,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    onSave(submitData);
  };

  /* ===== FOOTER ===== */
  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        label="Hủy"
        text
        onClick={() => {
          reset();
          setItems([]);
          onHide();
        }}
      />
      <Button
        label={isEditMode ? 'Cập nhật' : 'Tạo đơn'}
        icon="pi pi-check"
        severity="success"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );

  return (
    <>
      <Dialog
        header={isEditMode ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng mới'}
        visible={visible}
        style={{ width: '90vw', maxWidth: '1200px' }}
        modal
        footer={footer}
        onHide={onHide}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Khách hàng */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1.5 font-medium text-gray-700">
            Khách hàng <span className="text-red-500">*</span>
          </label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: 'Vui lòng chọn khách hàng' }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  {...field}
                  options={customers}
                  optionLabel="fullname"
                  optionValue="id"
                  placeholder="Chọn khách hàng"
                  filter
                  filterBy="fullname,email,phone"
                  className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                  panelClassName="text-sm"
                />
                {fieldState.error && (
                  <small className="p-error block mt-1">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700">
            Phương thức thanh toán <span className="text-red-500">*</span>
          </label>
          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  {...field}
                  options={paymentOptions}
                  placeholder="Chọn phương thức"
                  className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                />
                {fieldState.error && (
                  <small className="p-error block mt-1">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700">
            Trạng thái <span className="text-red-500">*</span>
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Vui lòng chọn trạng thái' }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  {...field}
                  options={statusOptions}
                  placeholder="Chọn trạng thái"
                  className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                />
                {fieldState.error && (
                  <small className="p-error block mt-1">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        {/* Ngày giao hàng */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700">Ngày giao hàng</label>
          <Controller
            name="shippingDate"
            control={control}
            render={({ field }) => (
              <Calendar
                {...field}
                dateFormat="dd/mm/yy"
                showIcon
                iconPos="right"
                className="w-full"
                placeholder="Chọn ngày (tùy chọn)"
                pt={{ input: { className: 'w-full' } }}
              />
            )}
          />
        </div>

          {/* ITEMS */}
          <div className="md:col-span-2">
            <div className="flex justify-between mb-2">
              <b>Sản phẩm</b>
              <Button
                type="button"
                label="Thêm sản phẩm"
                icon="pi pi-plus"
                size="small"
                onClick={openAddItemDialog}
              />
            </div>

            <DataTable value={items} emptyMessage="Chưa có sản phẩm">
              <Column
                header="Sản phẩm"
                body={(_, { rowIndex }) => (
                  <Dropdown
                    value={items[rowIndex].productId}
                    options={products}
                    optionLabel="name"
                    optionValue="id"
                    onChange={e =>
                      updateItem(rowIndex, 'productId', e.value)
                    }
                  />
                )}
              />
              <Column
                header="SL"
                body={(_, { rowIndex }) => (
                  <InputNumber
                    value={items[rowIndex].quantity}
                    min={1}
                    showButtons
                    onValueChange={e =>
                      updateItem(rowIndex, 'quantity', e.value ?? 1)
                    }
                  />
                )}
              />
              <Column
                header="Thành tiền"
                body={(_, { rowIndex }) =>
                  formatCurrency(
                    items[rowIndex].quantity * items[rowIndex].price
                  )
                }
              />
              <Column
                body={(_, { rowIndex }) => (
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    onClick={() => removeItem(rowIndex)}
                  />
                )}
              />
            </DataTable>

            <div className="text-right mt-3 font-bold">
              Tổng tiền: {formatCurrency(calculatedTotal)}
            </div>
          </div>
        </form>
      </Dialog>

      {/* ADD ITEM DIALOG */}
      <Dialog
        header="Thêm sản phẩm"
        visible={showAddItemDialog}
        modal
        style={{ width: 400 }}
        onHide={() => setShowAddItemDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button text label="Hủy" onClick={() => setShowAddItemDialog(false)} />
            <Button
              label="Thêm"
              severity="success"
              disabled={!newItem.productId}
              onClick={confirmAddItem}
            />
          </div>
        }
      >
        <Dropdown
          value={newItem.productId}
          options={products}
          optionLabel="name"
          optionValue="id"
          placeholder="Chọn sản phẩm"
          className="w-full mb-3"
          onChange={e => {
            const p = products.find(x => x.id === e.value);
            setNewItem({
              productId: e.value,
              quantity: 1,
              price: p?.price ?? 0,
            });
          }}
        />

        <InputNumber
          value={newItem.quantity}
          min={1}
          showButtons
          className="w-full"
          onValueChange={e =>
            setNewItem(prev => ({
              ...prev,
              quantity: e.value ?? 1,
            }))
          }
        />
      </Dialog>
    </>
  );
};

/* ===== UTILS ===== */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);

export default OrderForm;

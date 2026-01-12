import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import type { IOrderFormProps } from '@/types/order.types'; 

// Dữ liệu mẫu customers (đồng bộ từ OrderManagement)
const customers = [
    { id: 1, fullname: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0909123456' },
    { id: 2, fullname: 'Trần Thị B', email: 'b@gmail.com', phone: '0987654321' },
    { id: 3, fullname: 'Lê Văn C', email: 'c@gmail.com', phone: '0912345678' },
];

// Các tùy chọn đồng bộ từ OrderManagement
const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Canceled', value: 'Canceled' }
];

const paymentOptions = [
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Cash on Delivery', value: 'Cash on Delivery' },
    { label: 'Bank Transfer', value: 'Bank Transfer' }
];

interface OrderFormData {
    customerId: number | null;
    paymentMethod: string;
    status: string;
    shippingDate: Date | null;
    totalPrice: number;
}

const OrderForm = ({ visible, onHide, onSave, initialData, loading }: IOrderFormProps) => {
    
    const isEditMode = !!initialData;
    const headerTitle = isEditMode ? "Cập nhật thông tin đơn hàng" : "Thêm mới đơn hàng";

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<OrderFormData>({
        defaultValues: {
            customerId: null,
            paymentMethod: '',
            status: 'Pending',
            shippingDate: null,
            totalPrice: 0,
        }
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setValue('customerId', initialData.customerId);
                setValue('paymentMethod', initialData.paymentMethod);
                setValue('status', initialData.status);
                setValue('shippingDate', initialData.shippingDate ? new Date(initialData.shippingDate) : null);
                setValue('totalPrice', initialData.totalPrice);
            } else {
                reset({
                    customerId: null,
                    paymentMethod: '',
                    status: 'Pending',
                    shippingDate: null,
                    totalPrice: 0,
                });
            }
        }
    }, [visible, initialData, reset, setValue]);

    const handleClose = () => {
        reset();
        onHide();
    };

    const onSubmitHandler = (data: OrderFormData) => {
        // Chuyển shippingDate về string nếu cần (đồng bộ định dạng 'YYYY-MM-DD')
        if (data.shippingDate) {
            data.shippingDate = data.shippingDate.toISOString().split('T')[0] as any; // Type assertion để tránh lỗi type, nhưng lý tưởng là thay đổi type nếu cần
        }
        onSave(data);
    };

    const renderFooter = () => {
        return (
            <div className="flex justify-end gap-2 mt-4">
                <Button label="Hủy" icon="pi pi-times" text onClick={handleClose} className="p-button-secondary" />
                <Button 
                    label={isEditMode ? "Cập nhật" : "Tạo mới"} 
                    icon="pi pi-check" 
                    onClick={handleSubmit(onSubmitHandler)} 
                    loading={loading} 
                    autoFocus 
                />
            </div>
        );
    };

    return (
        <Dialog 
            header={headerTitle} 
            visible={visible} 
            style={{ width: '50rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '95vw' }} 
            onHide={handleClose}
            footer={renderFooter}
            modal
            className="p-fluid"
        >
            <div className="formgrid grid gap-4">
                <div className="field col-12">
                    <label htmlFor="customerId" className="font-medium">Khách hàng <span className="text-red-500">*</span></label>
                    <Controller
                        name="customerId"
                        control={control}
                        rules={{ required: 'Vui lòng chọn khách hàng' }}
                        render={({ field, fieldState }) => (
                            <Dropdown 
                                id={field.name} 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.value)} 
                                options={customers} 
                                optionLabel="fullname" 
                                optionValue="id"
                                placeholder="Chọn khách hàng"
                                className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                                filter
                            />
                        )}
                    />
                    {errors.customerId && <small className="p-error">{errors.customerId.message?.toString()}</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="paymentMethod" className="font-medium">Phương thức thanh toán <span className="text-red-500">*</span></label>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}
                        render={({ field, fieldState }) => (
                            <Dropdown 
                                id={field.name} 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.value)} 
                                options={paymentOptions} 
                                optionLabel="label" 
                                placeholder="Chọn phương thức"
                                className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                            />
                        )}
                    />
                    {errors.paymentMethod && <small className="p-error">{errors.paymentMethod.message?.toString()}</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="status" className="font-medium">Trạng thái <span className="text-red-500">*</span></label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Vui lòng chọn trạng thái' }}
                        render={({ field, fieldState }) => (
                            <Dropdown 
                                id={field.name} 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.value)} 
                                options={statusOptions} 
                                optionLabel="label" 
                                placeholder="Chọn trạng thái"
                                className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                            />
                        )}
                    />
                    {errors.status && <small className="p-error">{errors.status.message?.toString()}</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="shippingDate" className="font-medium">Ngày giao hàng</label>
                    <Controller
                        name="shippingDate"
                        control={control}
                        render={({ field }) => (
                            <Calendar 
                                id={field.name} 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.value)} 
                                dateFormat="yy-mm-dd"
                                showIcon
                                className="w-full"
                            />
                        )}
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="totalPrice" className="font-medium">Tổng giá trị <span className="text-red-500">*</span></label>
                    <Controller
                        name="totalPrice"
                        control={control}
                        rules={{ required: 'Vui lòng nhập tổng giá trị', min: { value: 0, message: 'Giá trị phải lớn hơn hoặc bằng 0' } }}
                        render={({ field, fieldState }) => (
                            <InputNumber 
                                id={field.name} 
                                value={field.value} 
                                onValueChange={(e) => field.onChange(e.value)} 
                                mode="currency" 
                                currency="VND" 
                                locale="vi-VN"
                                className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                            />
                        )}
                    />
                    {errors.totalPrice && <small className="p-error">{errors.totalPrice.message?.toString()}</small>}
                </div>
            </div>
        </Dialog>
    );
};

export default OrderForm;
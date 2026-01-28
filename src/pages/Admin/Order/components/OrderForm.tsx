import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';

interface OrderFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    loading?: boolean;
}

const mockCustomers = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0909123456' },
    { id: 2, name: 'Trần Thị B', phone: '0912345678' },
];

const mockProducts = [
    { id: 101, name: 'Bàn gỗ sồi', price: 1500000 },
    { id: 102, name: 'Ghế Sofa da', price: 3200000 },
    { id: 103, name: 'Tủ quần áo', price: 5000000 },
];

const OrderForm = ({ visible, onHide, onSave, loading }: OrderFormProps) => {
    const defaultValues = {
        customerId: null,
        paymentMethod: 0,
        status: 0,
        shippingDate: new Date(),
        orderDetails: [
            {
                productId: null,
                quantity: 1,
                isCustomize: false,
                customizeHeight: 0,
                customizeWidth: 0,
                customizeLong: 0,
                customizeMaterial: ''
            }
        ]
    };

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "orderDetails"
    });

    useEffect(() => {
        if (visible) {
            reset(defaultValues);
        }
    }, [visible, reset]);

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            shippingDate: data.shippingDate ? data.shippingDate.toISOString() : new Date().toISOString(),
            orderDetails: data.orderDetails.map((item: any) => {
                if (!item.isCustomize) {
                    return {
                        ...item,
                        customizeHeight: 0,
                        customizeWidth: 0,
                        customizeLong: 0,
                        customizeMaterial: ''
                    };
                }
                return item;
            })
        };
        onSave(payload);
    };

    const paymentOptions = [
        { label: 'Thanh toán khi nhận hàng (COD)', value: 0 },
        { label: 'Chuyển khoản ngân hàng', value: 1 }
    ];

    const renderFooter = () => (
        <div className="flex gap-2 justify-end pt-4 border-t">
            <Button label="Hủy" icon="pi pi-times" text onClick={onHide} className="!text-gray-500" />
            <Button 
                label="Tạo đơn hàng" 
                icon="pi pi-check" 
                loading={loading} 
                onClick={handleSubmit(onSubmit)} 
                className="!bg-purple-600 !border-purple-600 hover:!bg-purple-700" 
            />
        </div>
    );

    return (
        <Dialog 
            header="Tạo đơn hàng mới" 
            visible={visible} 
            style={{ width: '95%', maxWidth: '900px' }} 
            modal 
            onHide={onHide}
            footer={renderFooter()}
            className="p-fluid"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="field">
                        <label className="font-medium text-sm mb-1 block">Khách hàng <span className="text-red-500">*</span></label>
                        <Controller
                            name="customerId"
                            control={control}
                            rules={{ required: "Vui lòng chọn khách hàng" }}
                            render={({ field, fieldState }) => (
                                <Dropdown 
                                    id={field.name} 
                                    value={field.value} 
                                    onChange={(e) => field.onChange(e.value)} 
                                    options={mockCustomers} 
                                    optionLabel="name" 
                                    optionValue="id"
                                    placeholder="Chọn khách hàng" 
                                    filter 
                                    className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                                    itemTemplate={(option) => (
                                        <div className="flex flex-col">
                                            <span>{option.name}</span>
                                            <span className="text-xs text-gray-500">{option.phone}</span>
                                        </div>
                                    )}
                                />
                            )}
                        />
                        {errors.customerId && <small className="text-red-500 block">{errors.customerId.message}</small>}
                    </div>
                    <div className="field">
                        <label className="font-medium text-sm mb-1 block">Thanh toán</label>
                        <Controller
                            name="paymentMethod"
                            control={control}
                            render={({ field }) => (
                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={paymentOptions} optionLabel="label" placeholder="Chọn phương thức" />
                            )}
                        />
                    </div>
                    <div className="field">
                        <label className="font-medium text-sm mb-1 block">Ngày giao dự kiến</label>
                        <Controller
                            name="shippingDate"
                            control={control}
                            rules={{ required: "Chọn ngày giao" }}
                            render={({ field, fieldState }) => (
                                <Calendar 
                                    id={field.name} 
                                    value={field.value} 
                                    onChange={(e) => field.onChange(e.value)} 
                                    showIcon 
                                    showTime 
                                    hourFormat="24"
                                    className={classNames({ 'p-invalid': fieldState.invalid })}
                                />
                            )}
                        />
                        {errors.shippingDate && <small className="text-red-500 block">{errors.shippingDate.message}</small>}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-gray-800 m-0">Danh sách sản phẩm</h4>
                        <Button 
                            type="button" 
                            label="Thêm sản phẩm" 
                            icon="pi pi-plus" 
                            size="small" 
                            outlined 
                            onClick={() => append({ 
                                productId: null, quantity: 1, isCustomize: false, 
                                customizeHeight: 0, customizeWidth: 0, customizeLong: 0, customizeMaterial: '' 
                            })} 
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {fields.map((item, index) => {
                            const isCustomize = watch(`orderDetails.${index}.isCustomize`);
                            return (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 relative bg-white shadow-sm hover:shadow-md transition-all">
                                    {fields.length > 1 && (
                                        <Button 
                                            type="button" 
                                            icon="pi pi-trash" 
                                            className="!absolute top-2 right-2 !text-red-500 !w-8 !h-8" 
                                            text rounded 
                                            onClick={() => remove(index)} 
                                            tooltip="Xóa dòng này"
                                        />
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                        <div className="md:col-span-6">
                                            <label className="text-xs text-gray-500 mb-1 block">Sản phẩm</label>
                                            <Controller
                                                name={`orderDetails.${index}.productId` as const}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field, fieldState }) => (
                                                    <Dropdown 
                                                        value={field.value} 
                                                        options={mockProducts} 
                                                        onChange={(e) => field.onChange(e.value)} 
                                                        optionLabel="name" 
                                                        optionValue="id"
                                                        placeholder="Chọn sản phẩm..." 
                                                        filter
                                                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-gray-500 mb-1 block">Số lượng</label>
                                            <Controller
                                                name={`orderDetails.${index}.quantity` as const}
                                                control={control}
                                                rules={{ required: true, min: 1 }}
                                                render={({ field }) => (
                                                    <InputNumber 
                                                        value={field.value} 
                                                        onValueChange={(e) => field.onChange(e.value)} 
                                                        showButtons 
                                                        min={1} 
                                                        className="w-full"
                                                        inputClassName="text-center"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3 flex items-center h-full pt-5">
                                            <Controller
                                                name={`orderDetails.${index}.isCustomize` as const}
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex align-items-center">
                                                        <Checkbox inputId={`cust-${index}`} checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                                                        <label htmlFor={`cust-${index}`} className="ml-2 cursor-pointer select-none text-sm">Đặt làm riêng</label>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {isCustomize && (
                                        <div className="mt-4 bg-purple-50 p-3 rounded border border-purple-100 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-down">
                                            <div>
                                                <label className="text-xs text-purple-700 block mb-1">Dài (cm)</label>
                                                <Controller
                                                    name={`orderDetails.${index}.customizeLong` as const}
                                                    control={control}
                                                    render={({ field }) => <InputNumber value={field.value} onValueChange={(e) => field.onChange(e.value)} min={0} className="w-full" />}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-purple-700 block mb-1">Rộng (cm)</label>
                                                <Controller
                                                    name={`orderDetails.${index}.customizeWidth` as const}
                                                    control={control}
                                                    render={({ field }) => <InputNumber value={field.value} onValueChange={(e) => field.onChange(e.value)} min={0} className="w-full" />}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-purple-700 block mb-1">Cao (cm)</label>
                                                <Controller
                                                    name={`orderDetails.${index}.customizeHeight` as const}
                                                    control={control}
                                                    render={({ field }) => <InputNumber value={field.value} onValueChange={(e) => field.onChange(e.value)} min={0} className="w-full" />}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-purple-700 block mb-1">Chất liệu</label>
                                                <Controller
                                                    name={`orderDetails.${index}.customizeMaterial` as const}
                                                    control={control}
                                                    render={({ field }) => <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} className="w-full" placeholder="VD: Gỗ lim" />}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default OrderForm;
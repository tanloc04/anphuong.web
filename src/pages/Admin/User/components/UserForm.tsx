import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';

interface UserFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    loading?: boolean;
}

const UserForm = ({ visible, onHide, onSave, initialData, loading }: UserFormProps) => {
    const defaultValues = {
        username: '',
        email: '',
        fullname: '',
        phone: '',
        status: 'ACTIVE'
    };

    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({ defaultValues });

    useEffect(() => {
        if (initialData) {
            reset({
                username: initialData.username || '',
                email: initialData.email || '',
                fullname: initialData.fullname || '',
                phone: initialData.phone || '',
                status: initialData.status || 'ACTIVE'
            });
        } else {
            reset(defaultValues);
        }
    }, [initialData, reset, visible]);

    const onSubmit = (data: any) => {
        onSave(data);
    };

    const statusOptions = [
        { label: 'Hoạt động (Active)', value: 'ACTIVE' },
        { label: 'Đã khóa (Deactive)', value: 'DEACTIVE' }
    ];

    const renderFooter = () => {
        return (
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-50">
                <Button 
                    label="Hủy bỏ" 
                    icon="pi pi-times" 
                    text 
                    onClick={onHide} 
                    className="!text-gray-500 hover:!bg-gray-100 hover:!text-gray-800 transition-all"
                />
                <Button 
                    label="Lưu thay đổi" 
                    icon="pi pi-check" 
                    loading={loading} 
                    onClick={handleSubmit(onSubmit)} 
                    className="!bg-purple-600 !border-purple-600 hover:!bg-purple-700 focus:!ring-purple-200 transition-all shadow-sm"
                />
            </div>
        );
    };

    const renderField = (name: string, label: string, icon: string, disabled = false) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="font-medium text-gray-700 text-sm ml-1">
                {label} {disabled && <span className="text-gray-400 text-xs font-normal">(Không thể sửa)</span>}
            </label>
            <div className="relative">
                <i className={`pi ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`} />
                <Controller
                    name={name as any}
                    control={control}
                    rules={{ required: !disabled && `${label} là bắt buộc.` }}
                    render={({ field, fieldState }) => (
                        <InputText 
                            id={name} 
                            {...field} 
                            className={classNames('w-full !pl-10 !py-2.5 !rounded-md !border-gray-300 focus:!border-purple-500 focus:!ring-purple-200', { 'p-invalid': fieldState.invalid })} 
                            disabled={disabled}
                            placeholder={`Nhập ${label.toLowerCase()}...`}
                        />
                    )}
                />
            </div>
            {errors[name as keyof typeof errors] && <small className="text-red-500 ml-1">{(errors[name as keyof typeof errors] as any).message}</small>}
        </div>
    );

    return (
        <Dialog 
            header={
                <div className="flex align-items-center gap-3 text-purple-800">
                    <i className={`pi ${initialData ? 'pi-user-edit' : 'pi-user-plus'} text-xl`} />
                    <span className="font-bold text-lg">{initialData ? 'Cập nhật thông tin' : 'Thêm người dùng mới'}</span>
                </div>
            }
            visible={visible} 
            style={{ width: '95%', maxWidth: '700px' }}
            modal 
            className="p-fluid overflow-hidden rounded-lg"
            onHide={onHide}
            footer={renderFooter()}
            contentClassName="!py-6 !px-6 bg-white"
            headerClassName="!py-4 !px-6 !bg-purple-50 border-b border-purple-100"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderField('username', 'Tên đăng nhập', 'pi-user', true)}
                {renderField('fullname', 'Họ và tên', 'pi-id-card')}
                {renderField('email', 'Địa chỉ Email', 'pi-envelope', true)}
                {renderField('phone', 'Số điện thoại', 'pi-phone')}

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="status" className="font-medium text-gray-700 text-sm ml-1">Trạng thái hoạt động</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown 
                                id="status" 
                                {...field} 
                                options={statusOptions} 
                                optionLabel="label" optionValue="value"
                                className="w-full !rounded-md !border-gray-300 focus:!border-purple-500 focus:!ring-purple-200"
                                itemTemplate={(option) => (
                                    <div className="flex align-items-center gap-2">
                                        <i className={`pi pi-circle-fill text-sm ${option.value === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`} />
                                        <span>{option.label}</span>
                                    </div>
                                )}
                            />
                        )}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default UserForm;
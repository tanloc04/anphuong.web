import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import type { IUserFormProps } from '@/types/user.types';


const roles = [
    { label: 'Quản trị viên (Admin)', value: 'Admin' },
    { label: 'Khách hàng (Customer)', value: 'Customer' }
];

const provinces = [
  {label: "Tuyên Quang", value: "Tuyên Quang"},
  {label: "Cao Bằng", value: "Cao Bằng"},
  {label: "Lai Châu", value: "Lai Châu"},
  {label: "Lào Cai", value: "Lào Cai"},
  {label: "Thái Nguyên", value: "Thái Nguyên"},
  {label: "Điện Biên", value: "Điện Biên"},
  {label: "Lạng Sơn", value: "Lạng Sơn"},
  {label: "Sơn La", value: "Sơn La"},
  {label: "Phú Thọ", value: "Phú Thọ"},
  {label: "Bắc Ninh", value: "Bắc Ninh"},
  {label: "Quảng Ninh", value: "Quảng Ninh"},
  {label: "TP. Hà Nội", value: "TP. Hà Nội"},
  {label: "TP. Hải Phòng", value: "TP. Hải Phòng"},
  {label: "Hưng Yên", value: "Hưng Yên"},
  {label: "Ninh Bình", value: "Ninh Bình"},
  {label: "Thanh Hóa", value: "Thanh Hóa"},
  {label: "Nghệ An", value: "Nghệ An"},
  {label: "Hà Tĩnh", value: "Hà Tĩnh"},
  {label: "Quảng Trị", value: "Quảng Trị"},
  {label: "TP. Huế", value: "TP. Huế"},
  {label: "TP. Đà Nẵng", value: "TP. Đà Nẵng"},
  {label: "Quảng Ngãi", value: "Quảng Ngãi"},
  {label: "Gia Lai", value: "Gia Lai"},
  {label: "Đắk Lắk", value: "Đắk Lắk"},
  {label: "Khánh Hoà", value: "Khánh Hoà"},
  {label: "Lâm Đồng", value: "Lâm Đồng"},
  {label: "Đồng Nai", value: "Đồng Nai"},
  {label: "Tây Ninh", value: "Tây Ninh"},
  {label: "TP. Hồ Chí Minh", value: "TP. Hồ Chí Minh"},
  {label: "Đồng Tháp", value: "Đồng Tháp"},
  {label: "An Giang", value: "An Giang"},
  {label: "Vĩnh Long", value: "Vĩnh Long"},
  {label: "TP. Cần Thơ", value: "TP. Cần Thơ"},
  {label: "Cà Mau", value: "Cà Mau"},
];

const UserForm = ({ visible, onHide, onSave, initialData, loading }: IUserFormProps) => {
    
    const isEditMode = !!initialData;
    const headerTitle = isEditMode ? "Cập nhật thông tin người dùng" : "Thêm mới người dùng";

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            role: 'Customer',
            fullname: '',
            phone: '',
            address: ''
        }
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setValue('username', initialData.username);
                setValue('email', initialData.email);
                setValue('role', initialData.role || 'Customer');
                setValue('fullname', initialData.fullname || '');
                setValue('phone', initialData.phone || '');
                setValue('address', initialData.address || '');
            } else {
                reset({
                    username: '',
                    email: '',
                    password: '',
                    role: 'Customer',
                    fullname: '',
                    phone: '',
                    address: ''
                });
            }
        }
    }, [visible, initialData, reset, setValue]);

    const handleClose = () => {
        reset();
        onHide();
    };

    const onSubmitHandler = (data: any) => {
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
            <div className="card">
                <TabView>
                    <TabPanel header="Tài khoản" leftIcon="pi pi-id-card mr-2">
                        <div className="formgrid grid gap-4">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="username" className="font-medium">Username <span className="text-red-500">*</span></label>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: 'Vui lòng nhập Username' }}
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} 
                                            {...field} 
                                            disabled={isEditMode}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} 
                                            placeholder="VD: nguyenvan_a"
                                        />
                                    )}
                                />
                                {errors.username && <small className="p-error">{errors.username.message?.toString()}</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="email" className="font-medium">Email <span className="text-red-500">*</span></label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ 
                                        required: 'Vui lòng nhập Email',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email không hợp lệ"
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} 
                                            {...field} 
                                            // disabled={isEditMode}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} 
                                            placeholder="example@gmail.com"
                                        />
                                    )}
                                />
                                {errors.email && <small className="p-error">{errors.email.message?.toString()}</small>}
                            </div>

                            {!isEditMode && (
                                <div className="field col-12">
                                    <label htmlFor="password" className="font-medium">Mật khẩu <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: 'Vui lòng nhập mật khẩu' }}
                                        render={({ field, fieldState }) => (
                                            <Password 
                                                id={field.name} 
                                                {...field} 
                                                toggleMask 
                                                feedback={false}
                                                className={classNames({ 'p-invalid': fieldState.invalid })} 
                                                inputClassName="w-full"
                                            />
                                        )}
                                    />
                                    {errors.password && <small className="p-error">{errors.password.message?.toString()}</small>}
                                </div>
                            )}

                            <div className="field col-12">
                                <label htmlFor="role" className="font-medium">Vai trò</label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown 
                                            id={field.name} 
                                            value={field.value} 
                                            onChange={(e) => field.onChange(e.value)} 
                                            options={roles} 
                                            optionLabel="label" 
                                            placeholder="Chọn vai trò"
                                            className="w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Thông tin cá nhân" leftIcon="pi pi-user mr-2">
                        <div className="formgrid grid gap-4">
                            <div className="field col-12">
                                <label htmlFor="fullname" className="font-medium">Họ và tên</label>
                                <Controller
                                    name="fullname"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} placeholder="Nhập họ tên đầy đủ" />
                                    )}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="phone" className="font-medium">Số điện thoại</label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} keyfilter="int" placeholder="VD: 0987654321" />
                                    )}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="address" className="font-medium">Địa chỉ</label>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown 
                                            value={field.value} 
                                            options={provinces} 
                                            onChange={(e) => field.onChange(e.value)} 
                                            optionLabel="label" 
                                            placeholder="Chọn tỉnh thành" 
                                            filter 
                                            showClear
                                            className="w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Dialog>
    );
};

export default UserForm;
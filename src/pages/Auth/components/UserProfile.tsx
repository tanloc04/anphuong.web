import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';

import { useAuth } from '../../../context/auth.context';
import { authApi } from '@/api/authApi';
import type { IUpdateProfileRequest, IChangePasswordRequest } from '@/types/auth.types';

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

const UserProfile = () => {
    const { user } = useAuth(); 
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);

    const [customerDetail, setCustomerDetail] = useState<any>(null);

    const { control: controlInfo, handleSubmit: handleSubmitInfo, setValue: setValueInfo } = useForm<IUpdateProfileRequest>();
    
    const { control: controlPass, handleSubmit: handleSubmitPass, reset: resetPass, setError: setErrorPass, watch } = useForm<IChangePasswordRequest>();
    const newPassword = watch('newPassword');

    useEffect(() => {
        const fetchCustomerData = async () => {
            if (user?.username) {
                try {
                    const res = await authApi.getCustomerDetail(user.username);
                    if (res.data?.success && res.data.data?.pageData?.length > 0) {
                        const detail = res.data.data.pageData[0];
                        setCustomerDetail(detail);
                        setValueInfo('fullname', detail.fullname || '');
                        setValueInfo('phone', detail.phone || '');
                        setValueInfo('customerAddress', detail.customerAddress || '');
                    } 
                } catch (error: any) {
                    console.error("Lỗi tải thông tin chi tiết:", error);
                }
            }
        };
        fetchCustomerData();
    }, [user, setValueInfo]);

    const onUpdateInfo = async (data: IUpdateProfileRequest) => {
        const idToUpdate = customerDetail?.id || user?.id;
        if (!idToUpdate) return;
        
        setLoading(true);
        try {
            const res = await authApi.updateProfile(idToUpdate, data);
            
            if (res.data && res.data.success) {
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật hồ sơ thành công!' });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: res.data.message || "Cập nhật thất bại" });
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi kết nối";
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg });
        } finally {
            setLoading(false);
        }
    };

    const onChangePass = async (data: IChangePasswordRequest) => {
        if (data.newPassword !== data.confirmPassword) {
            setErrorPass("confirmPassword", { type: "manual", message: "Mật khẩu xác nhận không khớp" });
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.changePassword(data);
            
            if (res.data && res.data.success) {
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công!' });
                resetPass();
            } else {
                toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: res.data.message || "Không thể đổi mật khẩu" });
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi hệ thống";
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Đang tải thông tin hồ sơ...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Toast ref={toast} />
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">              
                <div className="md:col-span-1">
                    <Card className="shadow-lg text-center h-full">
                        <div className="flex flex-col items-center">
                            <Avatar 
                                label={user.username?.charAt(0).toUpperCase()} 
                                size="xlarge" 
                                shape="circle" 
                                className="bg-blue-600 text-white text-2xl mb-4"
                            />
                            <h2 className="text-xl font-bold text-gray-800">{customerDetail?.fullname || user.fullname}</h2>
                            <p className="text-gray-500 mb-2">@{user.username}</p>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Thành viên
                            </span>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <TabView>                        
                            <TabPanel header="Thông tin cá nhân" leftIcon="pi pi-user mr-2">
                                <form onSubmit={handleSubmitInfo(onUpdateInfo)} className="flex flex-col gap-4 p-2">                                 
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Email (Không thể thay đổi)</label>
                                        <InputText value={user.email} disabled className="bg-gray-100 opacity-70" />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Họ và tên</label>
                                        <Controller
                                            name="fullname"
                                            control={controlInfo}
                                            rules={{ required: 'Vui lòng nhập họ tên' }}
                                            render={({ field, fieldState }) => (
                                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Số điện thoại</label>
                                        <Controller
                                            name="phone"
                                            control={controlInfo}
                                            rules={{ required: 'Vui lòng nhập SĐT' }}
                                            render={({ field, fieldState }) => (
                                                <InputText id={field.name} keyfilter="int" {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Địa chỉ</label>
                                        <Controller
                                            name="customerAddress"
                                            control={controlInfo}
                                            render={({ field }) => (
                                                <Dropdown 
                                                    value={field.value} 
                                                    options={provinces} 
                                                    onChange={(e) => field.onChange(e.value)} 
                                                    optionLabel="label" 
                                                    placeholder="Chọn tỉnh thành"
                                                    filter showClear
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                    </div>

                                    <Button label="Lưu thay đổi" icon="pi pi-save" loading={loading} className="mt-2 w-max" />
                                </form>
                            </TabPanel>

                            <TabPanel header="Bảo mật" leftIcon="pi pi-lock mr-2">
                                <form onSubmit={handleSubmitPass(onChangePass)} className="flex flex-col gap-4 p-2">
                                    
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Mật khẩu hiện tại</label>
                                        <Controller
                                            name="oldPassword"
                                            control={controlPass}
                                            rules={{ required: 'Nhập mật khẩu cũ' }}
                                            render={({ field, fieldState }) => (
                                                <Password {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full" />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Mật khẩu mới</label>
                                        <Controller
                                            name="newPassword"
                                            control={controlPass}
                                            rules={{ required: 'Nhập mật khẩu mới', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } }}
                                            render={({ field, fieldState }) => (
                                                <Password {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full" />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                        <Controller
                                            name="confirmPassword"
                                            control={controlPass}
                                            rules={{ 
                                                required: 'Xác nhận mật khẩu',
                                                validate: (val) => val === newPassword || "Mật khẩu không khớp"
                                            }}
                                            render={({ field, fieldState }) => (
                                                <Password {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full" />
                                            )}
                                        />
                                    </div>

                                    <Button label="Đổi mật khẩu" icon="pi pi-check-circle" className="mt-2 w-max p-button-danger" loading={loading} />
                                </form>
                            </TabPanel>

                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
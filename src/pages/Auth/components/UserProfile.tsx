import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faCamera, faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from '../../../context/auth.context';
import { authApi } from '@/api/authApi';
import { useProvinces } from '../hooks';
import type { UpdateProfileRequest, ChangePasswordRequest } from '@/@types/auth.types';

const UserProfile = () => {
    const { user } = useAuth(); 
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
    const [customerDetail, setCustomerDetail] = useState<any>(null);

    const { provinces, isLoading } = useProvinces();

    const { control: controlInfo, handleSubmit: handleSubmitInfo, setValue: setValueInfo } = useForm<UpdateProfileRequest>();
    const { control: controlPass, handleSubmit: handleSubmitPass, reset: resetPass, setError: setErrorPass, watch } = useForm<ChangePasswordRequest>();
    const newPassword = watch('newPassword');

    
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const res = await authApi.getAccountInfo();
                    if (res.data && res.data.success) {
                        const detail = res.data.data;
                        setCustomerDetail(detail);
                        setValueInfo('fullname', detail.fullname || '');
                        setValueInfo('phone', detail.phone || '');
                        setValueInfo('customerAddress', detail.customerAddress || '');
                    }
                } catch (error) { console.error(error); }
            }
        };
        fetchProfile();
    }, [user, setValueInfo]);

    const onUpdateInfo = async (data: UpdateProfileRequest) => {
        const idToUpdate = customerDetail?.id || user?.id;
        if (!idToUpdate) return;
        setLoading(true);
        try {
            const res = await authApi.updateProfile(idToUpdate, data);
            if (res.data && res.data.success) {
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật thông tin!' });
                const newInfo = await authApi.getAccountInfo();
                if(newInfo.data?.success) setCustomerDetail(newInfo.data.data);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: res.data.message });
            }
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: "Lỗi kết nối" });
        } finally { setLoading(false); }
    };

    const onChangePass = async (data: ChangePasswordRequest) => {
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
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: res.data.message });
            }
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: "Lỗi hệ thống" });
        } finally { setLoading(false); }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><i className="pi pi-spin pi-spinner text-4xl text-[#c4a484]"></i></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Toast ref={toast} />
            <div className="relative h-60 bg-gray-800">
                <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="container max-w-6xl mx-auto px-4 h-full flex items-end pb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white tracking-wide ml-4 md:ml-0">Thiết lập tài khoản</h1>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 -mt-6 relative z-20">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="h-24 bg-[#c4a484]/10 border-b border-[#c4a484]/20 relative"></div>                         
                            <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                                <div className="relative mb-3">
                                    <Avatar 
                                        label={user.username?.charAt(0).toUpperCase()} 
                                        size="xlarge" 
                                        shape="circle" 
                                        className="w-24 h-24 text-4xl bg-[#c4a484] text-white border-4 border-white shadow-md"
                                        style={{ width: '6rem', height: '6rem' }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
                                        <FontAwesomeIcon icon={faCamera} className="text-gray-500 text-xs w-4 h-4" />
                                    </div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-800">{customerDetail?.fullname || user.fullname}</h2>
                                <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
                                
                                <div className="w-full border-t border-gray-100 my-2"></div>
                                
                                <div className="w-full text-left space-y-3 mt-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-[#c4a484] w-4" />
                                        <span className="truncate" title={user.email}>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faPhone} className="text-[#c4a484] w-4" />
                                        <span>{customerDetail?.phone || "Chưa có SĐT"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#c4a484] w-4" />
                                        <span className="truncate" title={customerDetail?.customerAddress}>
                                            {customerDetail?.customerAddress || "Chưa có địa chỉ"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
                            <div className="flex border-b border-gray-100">
                                <button 
                                    onClick={() => setActiveTab('info')}
                                    className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'info' ? 'border-[#c4a484] text-[#c4a484]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FontAwesomeIcon icon={faUser} className="mr-2"/> Thông tin chung
                                </button>
                                <button 
                                    onClick={() => setActiveTab('security')}
                                    className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'security' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FontAwesomeIcon icon={faLock} className="mr-2"/> Đổi mật khẩu
                                </button>
                            </div>

                            <div className="p-6 md:p-8">
                                {activeTab === 'info' && (
                                    <form onSubmit={handleSubmitInfo(onUpdateInfo)} className="space-y-5 animate-fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                                <Controller
                                                    name="fullname"
                                                    control={controlInfo}
                                                    rules={{ required: 'Vui lòng nhập họ tên' }}
                                                    render={({ field, fieldState }) => (
                                                        <InputText {...field} className={classNames('w-full p-inputtext-sm', { 'p-invalid': fieldState.invalid })} />
                                                    )}
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                                <Controller
                                                    name="phone"
                                                    control={controlInfo}
                                                    rules={{ required: 'Vui lòng nhập SĐT' }}
                                                    render={({ field, fieldState }) => (
                                                        <InputText keyfilter="int" {...field} className={classNames('w-full p-inputtext-sm', { 'p-invalid': fieldState.invalid })} />
                                                    )}
                                                />
                                            </div>

                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email đăng nhập</label>
                                                <div className="p-inputgroup">
                                                    <span className="p-inputgroup-addon bg-gray-50 text-gray-400">
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </span>
                                                    <InputText value={user.email} disabled className="bg-gray-50 text-gray-500 w-full p-inputtext-sm" />
                                                </div>
                                            </div>

                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                                <Controller
                                                    name="customerAddress"
                                                    control={controlInfo}
                                                    render={({ field }) => (
                                                        <Dropdown 
                                                            value={field.value} 
                                                            options={provinces} 
                                                            onChange={(e) => field.onChange(e.value)} 
                                                            optionLabel="label" 
                                                            optionValue="value"
                                                            placeholder={isLoading ? "Đang tải..." : "Chọn tỉnh thành"}
                                                            filter showClear
                                                            disabled={isLoading}
                                                            className="w-full p-inputtext-sm"
                                                            emptyFilterMessage="Không tìm thấy"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 text-right">
                                            <Button label="Lưu thay đổi" icon="pi pi-save" loading={loading} className="bg-[#c4a484] border-none px-6 py-2 text-sm" />
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'security' && (
                                    <form onSubmit={handleSubmitPass(onChangePass)} className="max-w-md mx-auto space-y-4 animate-fade-in pt-2">
                                        <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-700 border border-yellow-200 mb-4 flex gap-2">
                                            <i className="pi pi-info-circle mt-0.5"></i>
                                            <span>Mật khẩu cần ít nhất 6 ký tự để đảm bảo an toàn.</span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                            <Controller
                                                name="oldPassword"
                                                control={controlPass}
                                                rules={{ required: 'Nhập mật khẩu cũ' }}
                                                render={({ field, fieldState }) => (
                                                    <Password {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full p-inputtext-sm" />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                            <Controller
                                                name="newPassword"
                                                control={controlPass}
                                                rules={{ required: 'Nhập mật khẩu mới', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } }}
                                                render={({ field, fieldState }) => (
                                                    <Password {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full p-inputtext-sm" />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                            <Controller
                                                name="confirmPassword"
                                                control={controlPass}
                                                rules={{ required: 'Xác nhận mật khẩu', validate: (val) => val === newPassword || "Không khớp" }}
                                                render={({ field, fieldState }) => (
                                                    <Password {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })} inputClassName="w-full p-inputtext-sm" />
                                                )}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button label="Cập nhật mật khẩu" icon="pi pi-check" severity="danger" loading={loading} className="w-full py-2 text-sm" />
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import { Link } from "react-router-dom"

import type { ICustomerProps } from "../types"
import { registerCustomer } from "../request"

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

const Register = () => {

  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<ICustomerProps>({
    defaultValues: {
      email: "", password: "", confirmPassword: "",
      username: "", phone: "", customerAddress: ""
    }
  });

  const onSubmit = async (data: ICustomerProps) => {
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Xác nhận mật khẩu chưa khớp!" });
      setLoading(false);
      return;
    }

    const result = await registerCustomer(data);

    if (result.success) {
      toast.current?.show({ severity: "success", summary: "Thành công", detail: "Đăng ký tài khoản hoàn tất!", life: 3000 });
      setIsRegistered(true);
    } else {
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((err: any) => {
          setError(err.field as keyof ICustomerProps, {
            type: "server",
            message: err.message[0]
          });
        });
        toast.current?.show({ severity: "warn", summary: "Kiểm tra dữ liệu", detail: "Vui lòng xem lại các thông tin báo đỏ.", life: 3000 });
      }

      else if (result.globalError) {
        toast.current?.show({ severity: "error", summary: "Lỗi", detail: result.globalError, life: 3000 });
      }
    }

    setLoading(false);
  };

  const getFormErrorMessage = (name: keyof ICustomerProps) => {
    return errors[name] ? <small className="p-error text-red-500 text-xs mt-1 block">{errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  if (isRegistered) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 text-center">
          <i className="pi pi-envelope text-blue-500 text-6xl mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Kiểm tra Email của bạn</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Chúng tôi đã gửi một liên kết xác nhận đến email của bạn. <br />
            Vui lòng kiểm tra hộp thư đến (và cả mục Spam) để kích hoạt tài khoản.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/account/login">
              <Button label="Quay về trang đăng nhập" className="w-full"/>
            </Link>
            <Button 
                label="Gửi lại email (Demo)"
                className="w-full p-button-outlined p-button-secondary"
                onClick={() => toast.current?.show({ severity: "info", summary: "Info", detail: "Chức năng gửi lại đang phát triển." })}
            />
          </div>
        </div>
      </div>
    )
  }
  
  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Toast ref={toast}/>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-medium text-gray-700">Tên đăng nhập</label>
            <Controller 
              name="username"
              control={control}
              rules={{ required: "Nhập tên đăng nhập" }}
              render={({ field, fieldState }) => (
                <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}/>
              )}
            />
            {getFormErrorMessage("username")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="fullName" className="mb-2 font-medium text-gray-700">Họ và tên</label>
            <Controller 
              name="fullName"
              control={control}
              rules={{ required: "Nhập họ và tên" }}
              render={({ field, fieldState }) => (
                <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}/>
              )}
            />
            {getFormErrorMessage("fullName")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
            <Controller 
              name="email"
              control={control}
              rules={{ required: "Nhập email", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email không hợp lệ!" } }}
              render={({ field, fieldState }) => (
                <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}/>
              )}
            />
            {getFormErrorMessage("email")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 font-medium text-gray-700">Số điện thoại</label>
            <Controller 
              name="phone"
              control={control}
              rules={{ required: "Nhập số điện thoại" }}
              render={({ field, fieldState }) => (
                <InputText id={field.name} keyfilter="int" {...field} className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}/>
              )}
            />
            {getFormErrorMessage("phone")}
          </div>
          
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="customerAddress" className="mb-2 font-medium text-gray-700">Tỉnh/Thành phố</label>
            <Controller 
              name="customerAddress"
              control={control}
              rules={{ required: "Vui lòng chọn tỉnh/thành phố" }}
              render={({ field, fieldState }) => (
                <Dropdown 
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={provinces}
                  optionLabel="label"
                  placeholder="Chọn tỉnh/thành phố"
                  filter
                  showClear
                  className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}
                />
              )}
            />
            {getFormErrorMessage("customerAddress")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-medium text-gray-700">Mật khẩu</label>
            <Controller 
              name="password"
              control={control}
              rules={{ required: "Nhập mật khẩu" }}
              render={({ field, fieldState }) => (
                <Password 
                  id={field.name} {...field}
                  toggleMask
                  className={classNames({ "p-invalid" : fieldState.invalid }, "w-full")}
                  inputClassName="w-full"
                  feedback={false}
                />
              )}
            />
            {getFormErrorMessage("password")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 font-medium text-gray-700">Xác nhận mật khẩu</label>
            <Controller 
              name="confirmPassword"
              control={control}
              rules={{ required: "Xác nhận lại mật khẩu" }}
              render={({ field, fieldState }) => (
                <Password 
                  id={field.name} {...field}
                  toggleMask
                  className={classNames({ "p-invalid" : fieldState.invalid }, "w-full")}
                  inputClassName="w-full"
                  feedback={false}
                />
              )}
            />
            {getFormErrorMessage("confirmPassword")}
          </div>

          <div className="text-center">
            <p className="text-center justify-center">Bạn đã có 1 tài khoản?<Link to="/account/login"> Đăng nhập</Link></p>
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              label="Đăng Ký"
              icon="pi pi-check"
              loading={loading}
              className="w-full p-3 font-bold"
            />
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register
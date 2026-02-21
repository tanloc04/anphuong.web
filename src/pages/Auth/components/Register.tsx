import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import type { RegisterRequest } from "@/@types/auth.types";
import { useProvinces } from "../hooks";

const Register = () => {
  const { register, loading } = useAuth();

  const { provinces, isLoading } = useProvinces();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      phone: "",
      customerAddress: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterRequest) => {
    await register(data);
  };

  const getFormErrorMessage = (name: keyof RegisterRequest) => {
    return errors[name] ? (
      <small className="p-error text-red-500 text-xs mt-1 block">
        {errors[name]?.message}
      </small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Đăng Ký Tài Khoản
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-2 font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Nhập tên đăng nhập" }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                />
              )}
            />
            {getFormErrorMessage("username")}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="mb-2 font-medium text-gray-700"
            >
              Họ và tên
            </label>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Nhập họ và tên" }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                />
              )}
            />
            {getFormErrorMessage("fullName")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-gray-700">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Email không hợp lệ!",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                />
              )}
            />
            {getFormErrorMessage("email")}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 font-medium text-gray-700">
              Số điện thoại
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Nhập số điện thoại" }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  keyfilter="int"
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                />
              )}
            />
            {getFormErrorMessage("phone")}
          </div>

          <div className="flex flex-col md:col-span-2">
            <label
              htmlFor="customerAddress"
              className="mb-2 font-medium text-gray-700"
            >
              Tỉnh/Thành phố
            </label>
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
                  placeholder={isLoading ? "Đang tải..." : "Chọn tỉnh thành"}
                  filter
                  disabled={isLoading}
                  showClear
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                />
              )}
            />
            {getFormErrorMessage("customerAddress")}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-2 font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Nhập mật khẩu" }}
              render={({ field, fieldState }) => (
                <Password
                  id={field.name}
                  {...field}
                  toggleMask
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                  inputClassName="w-full"
                  feedback={false}
                />
              )}
            />
            {getFormErrorMessage("password")}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-2 font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Xác nhận lại mật khẩu",
                validate: (value) =>
                  value === password || "Mật khẩu xác nhận không khớp!",
              }}
              render={({ field, fieldState }) => (
                <Password
                  id={field.name}
                  {...field}
                  toggleMask
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full",
                  )}
                  inputClassName="w-full"
                  feedback={false}
                />
              )}
            />
            {getFormErrorMessage("confirmPassword")}
          </div>

          <div className="text-center md:col-span-2">
            <p className="text-center justify-center">
              Bạn đã có 1 tài khoản?
              <Link
                to="/account/login"
                className="text-blue-600 hover:underline font-semibold ml-1"
              >
                Đăng nhập
              </Link>
            </p>
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
};

export default Register;

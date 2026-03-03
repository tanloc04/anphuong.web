import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import type { RegisterRequest } from "@/@types/auth.types";
import { FormInput } from "@/components/common/form";
import { FormPassword } from "@/components/common/form";
import { ProgressSpinner } from "primereact/progressspinner";

const Register = () => {
  const { register, loading } = useAuth();

  const { control, handleSubmit, watch } = useForm<RegisterRequest>({
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

  const inputStyleClass =
    "w-full p-3.5 text-gray-800 bg-white/90 !border-none rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:!shadow-[0_0_0_2px_#c4a484]";
  const labelStyleClass = "text-gray-200 font-medium ml-1 text-sm";

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-2xl border border-white/20 flex flex-col items-center gap-4">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="4"
              fill="transparent"
              animationDuration=".5s"
              className="!stroke-[#c4a484]"
            />
            <span className="text-white font-medium tracking-wide text-sm animate-pulse">
              Đang đăng ký...
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md tracking-wide">
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-gray-200 text-sm font-light">
            Tạo tài khoản để quản lý ngôi nhà của bạn
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <div className="w-full">
            <FormInput
              name="username"
              control={control}
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              className={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{ required: "Vui lòng nhập tên đăng nhập" }}
            />
          </div>

          <div className="w-full">
            <FormInput
              name="fullName"
              control={control}
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              className={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{ required: "Vui lòng nhập họ và tên" }}
            />
          </div>

          <div className="w-full">
            <FormInput
              name="email"
              control={control}
              label="Email"
              placeholder="Nhập email của bạn"
              className={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Email không hợp lệ!",
                },
              }}
            />
          </div>

          <div className="w-full">
            <FormInput
              name="phone"
              control={control}
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              className={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{ required: "Vui lòng nhập số điện thoại" }}
            />
          </div>

          <div className="w-full">
            <FormPassword
              name="password"
              control={control}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{ required: "Vui lòng nhập mật khẩu" }}
            />
          </div>

          <div className="w-full">
            <FormPassword
              name="confirmPassword"
              control={control}
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName={inputStyleClass}
              labelClassName={labelStyleClass}
              rules={{
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === password || "Mật khẩu xác nhận không khớp!",
              }}
            />
          </div>

          <Button
            label="Đăng Ký"
            loading={loading}
            disabled={loading}
            className="w-full p-3.5 mt-2 font-bold text-white !bg-[#c4a484] !border-none !rounded-lg !hover:bg-[#a88b6e] transition-all shadow-lg !hover:shadow-[#c4a484]/40"
          />

          <div className="text-center mt-1">
            <span className="text-gray-300 text-sm">Đã có tài khoản? </span>
            <Link
              to="/account/login"
              className={`text-[#c4a484] hover:text-white font-semibold transition-colors underline decoration-solid ml-1 ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

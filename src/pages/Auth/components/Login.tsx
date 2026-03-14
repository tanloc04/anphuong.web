import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import type { LoginRequest } from "@/@types/auth.types";
import { FormInput } from "@/components/common/form";
import { FormPassword } from "@/components/common/form";
import { ProgressSpinner } from "primereact/progressspinner";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { jwtDecode } from "jwt-decode";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { authApi } from "@/api/authApi";

const Login = () => {
  const { login, loginGoogle, loading } = useAuth();
  const toast = useRef<Toast>(null);

  const { control, handleSubmit } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ================= STATE CHO QUÊN MẬT KHẨU =================
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP + Pass mới
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Xử lý gửi OTP
  const handleSendOtp = async () => {
    if (!forgotEmail) {
      toast.current?.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng nhập email",
      });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail });
      if (res.data?.success) {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Mã OTP đã được gửi vào email!",
        });
        setForgotStep(2);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Lỗi",
          detail: res.data?.message || "Email không tồn tại",
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotOtp || !forgotNewPassword) {
      toast.current?.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng nhập đầy đủ OTP và mật khẩu mới",
      });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await authApi.resetPassword({
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: forgotNewPassword,
      });
      if (res.data?.success) {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        });
        setForgotVisible(false);
        // Reset lại form
        setTimeout(() => {
          setForgotStep(1);
          setForgotEmail("");
          setForgotOtp("");
          setForgotNewPassword("");
        }, 500);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Lỗi",
          detail: res.data?.message || "Mã OTP không hợp lệ",
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    } finally {
      setForgotLoading(false);
    }
  };
  // ===========================================================

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await loginGoogle(credentialResponse.credential);
      }
    } catch (error: any) {
      if (
        error.response?.status === 403 ||
        error.response?.data?.message?.includes("not activated")
      ) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const userEmail = decoded?.email;

        confirmDialog({
          message: `Tài khoản ${userEmail} chưa được kích hoạt. Bạn có muốn nhận lại email kích hoạt không?`,
          header: "Tài khoản chưa kích hoạt",
          icon: "pi pi-exclamation-triangle",
          acceptLabel: "Gửi email",
          rejectLabel: "Đóng",
          accept: () => {
            if (userEmail) {
              // resendEmail(userEmail); // Đảm bảo hàm này được import hoặc định nghĩa
            }
          },
        });
      }
    }
  };

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  const inputStyleClass =
    "w-full p-3.5 text-gray-800 bg-white/90 !border-none rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:!shadow-[0_0_0_2px_#c4a484]";
  const labelStyleClass = "text-gray-200 font-medium ml-1 text-sm";

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden">
      <Toast ref={toast} />

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
              Đang đăng nhập...
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
            Chào mừng trở lại
          </h2>
          <p className="text-gray-200 text-sm font-light">
            Đăng nhập để quản lý ngôi nhà của bạn
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
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

          <div className="w-full relative">
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

            <div className="flex justify-end mt-2">
              <span
                onClick={() => setForgotVisible(true)}
                className="text-[#c4a484] text-sm font-medium hover:text-white transition-colors cursor-pointer hover:underline"
              >
                Quên mật khẩu?
              </span>
            </div>
          </div>

          <Button
            label="Đăng Nhập"
            loading={loading}
            disabled={loading}
            className="w-full p-3.5 mt-2 font-bold text-white !bg-[#c4a484] !border-none !rounded-lg !hover:bg-[#a88b6e] transition-all shadow-lg !hover:shadow-[#c4a484]/40"
          />

          <div className="text-center mt-1">
            <span className="text-gray-300 text-sm">Chưa có tài khoản? </span>
            <Link
              to="/account/register"
              className={`text-[#c4a484] hover:text-white font-semibold transition-colors underline decoration-solid ml-1 ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              Đăng ký ngay
            </Link>
          </div>

          <div className="relative mt-2 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-transparent text-gray-300">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-4 w-full h-[40px]">
            <div className="w-full flex justify-center">
              <ConfirmDialog />
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google Login Failed")}
                useOneTap
                type="standard"
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>
          </div>
        </form>
      </div>

      {/* ================= DIALOG QUÊN MẬT KHẨU ================= */}
      <Dialog
        header="Khôi phục mật khẩu"
        visible={forgotVisible}
        style={{ width: "400px" }}
        onHide={() => {
          if (!forgotLoading) {
            setForgotVisible(false);
            setTimeout(() => setForgotStep(1), 300);
          }
        }}
        draggable={false}
        className="p-fluid"
      >
        {forgotStep === 1 ? (
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-sm text-gray-600">
              Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi cho bạn
              một mã xác nhận (OTP).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email của bạn
              </label>
              <InputText
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full p-3"
              />
            </div>
            <Button
              label="Gửi mã OTP"
              onClick={handleSendOtp}
              loading={forgotLoading}
              className="mt-2 w-full !bg-[#c4a484] !border-none"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-sm text-gray-600">
              Mã OTP đã được gửi đến{" "}
              <span className="font-bold">{forgotEmail}</span>.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác nhận (OTP)
              </label>
              <InputText
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="Nhập mã 6 số"
                className="w-full p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <Password
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                toggleMask
                feedback={false}
                placeholder="Nhập mật khẩu mới"
                inputClassName="w-full p-3"
              />
            </div>
            <Button
              label="Đặt lại mật khẩu"
              onClick={handleResetPassword}
              loading={forgotLoading}
              className="mt-2 w-full !bg-[#c4a484] !border-none"
            />
            <div className="text-center mt-2">
              <span
                onClick={() => setForgotStep(1)}
                className="text-sm text-gray-500 cursor-pointer hover:text-[#c4a484] hover:underline"
              >
                Quay lại nhập Email
              </span>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Login;

import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import { useNavigate } from "react-router-dom"

import type { ILoginRequest } from "../types"
import { login , getUserProfile, loginWithGoogle} from "../request"

import { GoogleLogin } from '@react-oauth/google'


const Login = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, setError, formState: { errors } } = useForm<ILoginRequest>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLoginSuccess = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const userResult = await getUserProfile();

    if (userResult.success && userResult.data) {
      const realUsername = userResult.data.username;
      localStorage.setItem("username", realUsername);
      localStorage.setItem("email", userResult.data.email);

      window.dispatchEvent(new Event("auth-change"));

      toast.current?.show({ severity: "success", summary: "Thành công", detail: `Chào mừng ${realUsername}!`, life: 3000 });
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.current?.show({ severity: "warn", summary: "Cảnh báo", detail: "Đăng nhập thành công nhưng không tải được thông tin!", life: 3000 });
      setTimeout(() => navigate('/'), 1000);
    }
  }

  const onSubmit = async (data: ILoginRequest) => {
    setLoading(true);
    const loginResult = await login(data);

    if (loginResult.success && loginResult.data) {
      localStorage.setItem("token", loginResult.data.token);
      localStorage.setItem("refreshToken", loginResult.data.refreshToken);

      const userResult = await getUserProfile();

      if (userResult.success && userResult.data) {
        const realUsername = userResult.data.username;
        
        localStorage.setItem('username', realUsername);

        window.dispatchEvent(new Event("auth-change"));

        toast.current?.show({ severity: "success", summary: "Thành công", detail: `Chào mừng ${realUsername} quay lại!`, life: 3000 });

        setTimeout(() => navigate("/"), 1000);

      } else {
        toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Đăng nhập thành công nhưng không tải được thông tin.', life: 3000 });
        setTimeout(() => navigate('/'), 1000);
      }

    } else {
      if (loginResult.message) {
        toast.current?.show({ severity: "error", summary: "Đăng nhập thất bại", detail: loginResult.message, life: 3000 });
      }

      if (loginResult.errors) {
        loginResult.errors.forEach((err) => {
          setError(err.field as keyof ILoginRequest, {
            type: "server",
            message: err.message[0]
          });
        });
      }
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    if (credentialResponse.credential) {
      const result = await loginWithGoogle(credentialResponse.credential);

      if (result.success && result.data) {
        await handleLoginSuccess(result.data.token, result.data.refreshToken);
      } else {
        toast.current?.show({ severity: "error", summary: "Lỗi Google", detail: result.message || "Không thể đăng nhập với Google!" });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Toast ref={toast}/>
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <span className="p-float-label">
                <Controller 
                  name="email"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Email không hợp lệ!"
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid }, "w-full p-3")}/>
                  )}
                />
                <label htmlFor="email">Email</label>
              </span>
              {errors.email && <small className="p-error block mt-1">{errors.email.message}</small>}
            </div>

            <div>
              <span className="p-float-label">
                <Controller 
                  name="password"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập mật khẩu",                   
                  }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      feedback={false}
                      className={classNames({ "p-invalid": fieldState.invalid }, "w-full")}
                      inputClassName="w-full p-3"
                    />
                  )}
                />
                <label htmlFor="password">Mật khẩu</label>
              </span>
              {errors.password && <small className="p-error block mt-1">{errors.password.message}</small>}
            </div>
            <Button label="Đăng Nhập" icon="pi pi-sign-in" loading={loading} className="w-full p-3 mt-2 font-bold" />
            <div className="mt-6 border-t pt-4">
              <p className="text-center text-gray-500 text-sm mb-3">Hoặc đăng nhập với</p>
              <div className="flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Đăng nhập bằng Google thất bại!"});
                  }}
                  useOneTap
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
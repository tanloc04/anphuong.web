import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { GoogleLogin } from '@react-oauth/google';
import { Link } from "react-router-dom";

import { useAuth } from "../../../context/auth.context";
import type { ILoginRequest } from "@/types/auth.types";

const Login = () => {
  const { login, loginGoogle, loading } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<ILoginRequest>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: ILoginRequest) => {
    await login(data);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      console.log(`idToken: ${credentialResponse.credential}`)
      await loginGoogle(credentialResponse.credential);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
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
                rules={{ required: "Vui lòng nhập mật khẩu" }}
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
          
          <div className="text-center mt-2">
             <span>Chưa có tài khoản? </span>
             <Link to="/account/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-center text-gray-500 text-sm mb-3">Hoặc đăng nhập với</p>
            <div className="flex justify-center">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess}
                onError={() => {
                   console.log("Google Login Failed (Client Side)");
                }}
                useOneTap
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
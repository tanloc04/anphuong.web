import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { GoogleLogin } from '@react-oauth/google'; 
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import type { ILoginRequest } from "@/types/auth.types";
import { FormInput } from "@/components/common/form";
import { FormPassword } from "@/components/common/form";

const Login = () => {
  const { login, loginGoogle, loading } = useAuth();

  const { control, handleSubmit } = useForm<ILoginRequest>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
        await loginGoogle(credentialResponse.credential);
    }
  };

  const onSubmit = async (data: ILoginRequest) => {
    await login(data);
  };

  const inputStyleClass = "w-full p-3.5 text-gray-800 bg-white/90 !border-none rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:!shadow-[0_0_0_2px_#c4a484]";
  const labelStyleClass = "text-gray-200 font-medium ml-1 text-sm";

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden">
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
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
                    message: "Email không hợp lệ!"
                  }
                }}
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

          <Button
            label="Đăng Nhập" 
            loading={loading} 
            className="w-full p-3.5 mt-2 font-bold text-white !bg-[#c4a484] !border-none !rounded-lg !hover:bg-[#a88b6e] transition-all shadow-lg !hover:shadow-[#c4a484]/40" 
          />
          
          <div className="text-center mt-1">
             <span className="text-gray-300 text-sm">Chưa có tài khoản? </span>
             <Link to="/account/register" className="text-[#c4a484] hover:text-white font-semibold transition-colors underline decoration-solid ml-1">
               Đăng ký ngay
             </Link>
          </div>

          <div className="relative mt-2 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-transparent text-gray-300">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="flex justify-center mt-4 w-full">         
             <div className="w-full flex justify-center"> 
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
    </div>
  );
}

export default Login;
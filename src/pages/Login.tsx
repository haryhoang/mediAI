import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { AuthLayout } from "../components/ui/AuthLayout";
import { ROUTES } from "../constants/routes";

const loginSchema = z.object({
  phone: z.string().regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login submitted:", data);
    // Simulate login and redirect to dashboard
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle="Đăng nhập để tiếp tục chia sẻ triệu chứng"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Số điện thoại
            </label>
            <input
              {...register("phone")}
              placeholder="0985026784"
              className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
            />
            {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="********"
                className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <button 
              type="button"
              className="text-sm font-medium text-medi-teal hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-medi-teal/20">
            Đăng nhập
          </Button>
        </form>
      </motion.div>

      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          Chưa có tài khoản?{" "}
          <button 
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-medi-teal font-bold hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Shield, 
  Eye, 
  EyeOff,
  Check
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { AuthLayout } from "../components/ui/AuthLayout";
import { ROUTES } from "../constants/routes";

const registerSchema = z.object({
  bhyt: z.string().min(10, "Mã thẻ BHYT không hợp lệ").max(15, "Mã thẻ BHYT không hợp lệ"),
  fullName: z.string().min(2, "Họ và tên quá ngắn"),
  birthYear: z.string().regex(/^\d{4}$/, "Năm sinh không hợp lệ"),
  phone: z.string().regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  agree: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agree: false,
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Form submitted:", data);
    // Pass phone number to OTP page
    navigate(ROUTES.OTP_VERIFY, { state: { phone: data.phone } });
  };

  return (
    <AuthLayout 
      title="Đăng ký tài khoản" 
      subtitle="Tạo tài khoản để bắt đầu chia sẻ sức khỏe với chúng tôi"
    >
      {/* Security Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 mb-8"
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <Shield className="text-blue-500 w-5 h-5" />
        </div>
        <div className="text-sm leading-relaxed">
          <span className="font-bold text-blue-900">Bảo mật thông tin:</span>{" "}
          <span className="text-blue-800/80">
            Thông tin của bạn được mã hóa và chỉ chia sẻ với bác sĩ khi bạn đến khám. Chúng tôi tuân thủ các quy định về bảo mật y tế.
          </span>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* BHYT */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Mã thẻ BHYT <span className="text-red-500">*</span>
            </label>
            <input
              {...register("bhyt")}
              placeholder="HS40127014102"
              className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.bhyt ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
            />
            <p className="text-xs text-slate-400 ml-1">15 số trên thẻ bảo hiểm y tế của bạn</p>
            {errors.bhyt && <p className="text-xs text-red-500 ml-1">{errors.bhyt.message}</p>}
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              {...register("fullName")}
              placeholder="Nguyễn Ngọc Ly"
              className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.fullName ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
            />
            {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
          </div>

          {/* Birth Year */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Năm sinh <span className="text-red-500">*</span>
            </label>
            <input
              {...register("birthYear")}
              placeholder="2002"
              className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.birthYear ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
            />
            {errors.birthYear && <p className="text-xs text-red-500 ml-1">{errors.birthYear.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              placeholder="0984034011"
              className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
            />
            <p className="text-xs text-slate-400 ml-1">Số điện thoại để nhận mã xác thực OTP</p>
            {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all`}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Agreement */}
          <div className="bg-medi-teal/5 rounded-2xl p-4 flex gap-3 items-start">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                {...register("agree")}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-medi-teal checked:bg-medi-teal focus:outline-none"
              />
              <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <label className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
              Tôi đồng ý chia sẻ thông tin cho bác sĩ khi đi khám và chấp nhận{" "}
              <span className="text-medi-teal font-bold hover:underline">Điều khoản sử dụng</span>
            </label>
          </div>
          {errors.agree && <p className="text-xs text-red-500 ml-1">{errors.agree.message}</p>}

          <Button type="submit" className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-medi-teal/20">
            Đăng ký & nhận mã xác thực
          </Button>
        </form>
      </motion.div>

      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          Đã có tài khoản?{" "}
          <button 
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-medi-teal font-bold hover:underline"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

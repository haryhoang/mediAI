import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/ui/AuthLayout";
import { ROUTES } from "../constants/routes";

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "0912345678";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
      // Simulate verification
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    }
  };

  const handleResend = () => {
    if (isResendActive) {
      setTimer(60);
      setIsResendActive(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <AuthLayout 
      title="Xác thực tài khoản" 
      subtitle={`Nhập mã 6 số đã được gửi đến số điện thoại ${phone}`}
    >
      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
        >
          <p className="text-sm text-slate-500 mb-8">Mã xác thực đã được gửi qua SMS</p>
          
          <div className="flex justify-between gap-2 mb-10">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-2xl font-bold text-center bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal transition-all"
              />
            ))}
          </div>

          <Button 
            onClick={handleVerify}
            disabled={otp.some(d => !d) || isSuccess}
            className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-medi-teal/20 mb-8"
          >
            {isSuccess ? "Đang xác thực..." : "Xác thực"}
          </Button>

          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Không nhận được mã?{" "}
              <button 
                onClick={handleResend}
                disabled={!isResendActive}
                className={`font-bold transition-colors ${isResendActive ? 'text-medi-teal hover:underline' : 'text-slate-300 cursor-not-allowed'}`}
              >
                Gửi lại
              </button>
            </p>
            
            {timer > 0 && (
              <p className="text-xs text-slate-400">
                Gửi lại sau <span className="font-mono font-bold text-medi-teal">{timer}s</span>
              </p>
            )}
          </div>
        </motion.div>

        <button 
          onClick={() => navigate(-1)}
          className="mt-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mx-auto font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-medi-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-medi-teal" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thành công!</h3>
              <p className="text-slate-500 mb-8">Tài khoản của bạn đã được xác thực. Đang chuyển hướng đăng nhập...</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-medi-teal"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

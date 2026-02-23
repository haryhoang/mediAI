import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [bhytId, setBhytId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bhytId.length < 10) {
      setError("Mã BHYT không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we accept any ID that matches our mock patient
      // or just navigate if it's not empty for the sake of the prototype
      if (bhytId.includes("1234567890") || bhytId === "GD4791234567890") {
        navigate(ROUTES.DOCTOR_DASHBOARD, { state: { bhytId } });
      } else {
        setError("Không tìm thấy hồ sơ bệnh nhân với mã BHYT này.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <div className="w-8 h-8 bg-medi-teal rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi Doctor</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">BS. Nguyễn Văn An</p>
              <p className="text-[10px] text-slate-400">Khoa Nội Tổng Quát</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Bác sĩ</h1>
            <p className="text-slate-500">Tra cứu thông tin triệu chứng bệnh nhân đã chia sẻ trước</p>
          </div>

          <Card className="p-8 md:p-12 border-slate-200 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nhập mã BHYT</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-medi-teal transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={bhytId}
                    onChange={(e) => setBhytId(e.target.value.toUpperCase())}
                    placeholder="VD: GD4791234567890"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-mono tracking-widest focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal outline-none transition-all"
                    maxLength={15}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !bhytId}
                      className="rounded-xl px-6"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tìm kiếm"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Nhập mã thẻ BHYT 15 số để xem thông tin triệu chứng bệnh nhân đã chia sẻ
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </form>
          </Card>

          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Nhập mã BHYT để bắt đầu</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs">
        <p>© 2024 Medi Health Platform • Hệ thống dành riêng cho nhân viên y tế</p>
      </footer>
    </div>
  );
}

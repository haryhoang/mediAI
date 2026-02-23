import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  LogOut, 
  Mic, 
  Upload, 
  Calendar, 
  FileText, 
  ChevronRight,
  Clock,
  User
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { BookingModal } from "../components/BookingModal";
import { ROUTES } from "../constants/routes";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
          <div className="w-10 h-10 bg-medi-teal rounded-full flex items-center justify-center">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">Medi</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Người dùng</p>
              <p className="text-xs text-slate-500">ID HS47127014102</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <User className="text-slate-400 w-6 h-6" />
            </div>
          </div>
          
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const CircularProgress = ({ date }: { date: string }) => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth="12"
        />
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="transparent"
          stroke="#26a69a"
          strokeWidth="12"
          strokeDasharray={552.92}
          strokeDashoffset={138.23} // 75% progress
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Calendar className="w-6 h-6 text-medi-teal mb-2" />
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ngày tái khám</p>
        <p className="text-xl font-bold text-slate-800">{date}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("22/02/2026");
  const [isPending, setIsPending] = useState(false);

  const historyData = [
    {
      id: 1,
      date: "15/02/2026",
      hospital: "Bệnh viện Đa khoa khu vực Thủ Đức",
      doctor: "BS. Nguyễn Văn An",
      diagnosis: "Viêm họng cấp",
      meds: [
        { name: "Amoxicillin 500mg", dosage: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn" },
        { name: "Paracetamol 500mg", dosage: "Ngày uống 3 lần khi sốt trên 38.5 độ" }
      ],
      vitals: { pulse: "82", temp: "37.5", bp: "120/80", resp: "18" }
    },
    {
      id: 2,
      date: "18/09/2025",
      hospital: "Bệnh viện đa khoa khu vực Thủ Đức",
      doctor: "BS. Trần Thị Bình",
      diagnosis: "Chấn thương phần mềm",
      meds: [
        { name: "Ibuprofen 400mg", dosage: "Ngày uống 2 lần sau ăn" },
        { name: "Alpha Choay", dosage: "Ngày ngậm 4 viên chia 2 lần" }
      ],
      vitals: { pulse: "78", temp: "36.8", bp: "115/75", resp: "16" }
    },
    {
      id: 3,
      date: "10/01/2025",
      hospital: "Bệnh viện Tim Mạch TP.HCM",
      doctor: "BS. Lê Văn Khoa",
      diagnosis: "Kiểm tra định kỳ",
      meds: [
        { name: "Amlodipine 5mg", dosage: "Uống 1 viên vào buổi sáng" }
      ],
      vitals: { pulse: "72", temp: "36.5", bp: "130/85", resp: "16" }
    },
  ];

  const handleViewRecord = (record: any) => {
    navigate(ROUTES.AI_SUMMARY, { 
      state: { 
        isViewMode: true,
        recordData: record
      } 
    });
  };

  const handleBookingConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setAppointmentDate(formattedDate);
    setIsPending(true);
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-slate-500">Quản lý sức khỏe của bạn một cách an toàn và thuận tiện</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Column 1: Share Status */}
          <Card className="flex flex-col h-full">
            <div className="w-10 h-10 bg-medi-teal/10 rounded-xl flex items-center justify-center mb-6">
              <Mic className="text-medi-teal w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Chia sẻ sức khỏe của bạn</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Ghi âm hoặc tải hình ảnh triệu chứng trước khi thăm khám
            </p>
            
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-medi-teal rounded-full flex items-center justify-center shadow-lg shadow-medi-teal/30 mb-10"
              >
                <Mic className="text-white w-10 h-10" />
              </motion.button>
              
              <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="text-medi-teal w-6 h-6 mb-2" />
                <p className="text-sm font-bold text-slate-700">Tải hình ảnh</p>
                <p className="text-xs text-slate-400">PNG, JPG (tối đa 10MB)</p>
              </div>
            </div>
            
            <Button className="w-full mt-8 py-3.5" onClick={() => navigate(ROUTES.SYMPTOM_INPUT)}>Bắt đầu chia sẻ</Button>
          </Card>

          {/* Column 2: Re-examination Support */}
          <Card className="flex flex-col h-full">
            <div className="w-10 h-10 bg-medi-teal/10 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="text-medi-teal w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Hỗ trợ tái khám</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Theo dõi lịch hẹn và nhắc nhở tái khám
            </p>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <CircularProgress date={appointmentDate} />
              
              <div className="w-full mt-10 bg-slate-50 rounded-2xl p-5 space-y-3">
                {isPending ? (
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold">Đang chờ xác nhận</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-4 h-4 text-medi-teal" />
                      <span className="text-sm font-medium">09:00 - 10:00</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <User className="w-4 h-4 text-medi-teal" />
                      <span className="text-sm font-medium">BS. Nguyễn Văn An</span>
                    </div>
                  </>
                )}
                <p className="text-xs text-slate-400 pl-7">Khám theo dõi sau điều trị</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-8 py-3.5 bg-white"
              onClick={() => setIsBookingOpen(true)}
            >
              Đặt lịch
            </Button>
          </Card>

          {/* Column 3: Storage & History */}
          <Card className="flex flex-col h-full">
            <div className="w-10 h-10 bg-medi-teal/10 rounded-xl flex items-center justify-center mb-6">
              <FileText className="text-medi-teal w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Lưu trữ & lịch sử khám bệnh</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Xem chi tiết hồ sơ và lịch sử khám bệnh
            </p>
            
            <div className="flex-1 space-y-4">
              {historyData.map((item, index) => (
                <div key={item.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index !== historyData.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-100" />
                  )}
                  
                  <div className="w-10 h-10 bg-medi-teal/10 rounded-full flex items-center justify-center shrink-0 z-10">
                    <FileText className="text-medi-teal w-5 h-5" />
                  </div>
                  
                  <div 
                    onClick={() => handleViewRecord(item)}
                    className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 hover:border-medi-teal/30 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300">{item.date}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-medi-teal transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-snug">{item.hospital}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-8 py-3.5 bg-white">Xem tất cả hồ sơ</Button>
          </Card>
        </div>
      </main>
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirm={handleBookingConfirm}
        initialDate={new Date(2026, 1, 22)}
      />
    </div>
  );
}

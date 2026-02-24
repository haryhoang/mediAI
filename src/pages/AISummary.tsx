import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  Check, 
  Loader2,
  AlertCircle,
  Edit3,
  CheckCircle,
  Printer,
  Share2,
  Download,
  Shield,
  Eye,
  Users,
  X,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";

interface SummaryData {
  symptoms: string[];
  medicines: string[];
  vital_signs: {
    pulse?: string;
    temperature?: string;
    blood_pressure?: string;
    respiratory_rate?: string;
    height?: string;
    weight?: string;
  };
  clinical_note: string;
}

export default function AISummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyOption, setPrivacyOption] = useState<'me' | 'doctor'>('doctor');
  const [recordId, setRecordId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [signedDate, setSignedDate] = useState(() => new Date().toLocaleString('vi-VN'));

  const { transcript, images, medicationImages, previousResultImages, isViewMode, recordData } = location.state || {};

  // Mock Administrative Data
  const patientInfo = {
    name: "ĐẶNG THỊ HẰNG NGA",
    gender: "Nữ",
    birthYear: "1995",
    bhytId: "GD 4 79 1234567890",
    phone: "090****123",
    address: "Thủ Đức, TP. Hồ Chí Minh"
  };

  useEffect(() => {
    if (isViewMode && recordData) {
      setSummaryData({
        symptoms: [recordData.diagnosis],
        medicines: recordData.meds.map((m: any) => `${m.name} (${m.dosage})`),
        vital_signs: recordData.vital_signs || recordData.vitals,
        clinical_note: `Chẩn đoán bởi ${recordData.doctor}`
      });
      setRecordId(recordData.id.toString().padStart(9, '0'));
      setSignedDate(recordData.date);
      setIsLoading(false);
      return;
    }

    if (!transcript && images?.length === 0 && medicationImages?.length === 0 && previousResultImages?.length === 0) {
      setIsLoading(false);
      return;
    }

const generateSummary = async () => {
  try {
    setIsLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Không tìm thấy API Key trong cấu hình hệ thống.");
    }

    
    const genAI = new GoogleGenerativeAI(apiKey);

  
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
   
    const prompt = `Bạn là thư ký y khoa. Hãy phân tích nội dung sau và trả về JSON:
      Nội dung: "${transcript}"
      Yêu cầu JSON có cấu trúc: { "symptoms": [], "medicines": [], "vital_signs": {"pulse": "", "temperature": "", "blood_pressure": ""}, "clinical_note": "" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Với responseMimeType: "application/json", AI sẽ trả về JSON thuần
    // nên bạn không cần bước replace "```json" nữa, nhưng để an toàn thì cứ giữ lại
    const cleanText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanText);
    
    setSummaryData(data);
  } catch (err: any) {
    console.error("Lỗi kết nối AI:", err);
    // Nếu lỗi vẫn là 404, hãy kiểm tra xem thư viện @google/generative-ai có bản mới nhất chưa
    setError("Lỗi: " + (err.message || "Không thể kết nối AI"));
  } finally {
    setIsLoading(false);
  }
};
    generateSummary();
  }, [transcript, images, medicationImages, previousResultImages]);

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate(ROUTES.COMPLETION, { state: { ...location.state, summaryData, recordId } });
    }, 1500);
  };

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Thiếu dữ liệu</h2>
          <p className="text-slate-500 mb-6">Vui lòng quay lại trang nhập triệu chứng.</p>
          <Button onClick={() => navigate(ROUTES.SYMPTOM_INPUT)}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  const renderVitalValue = (val?: string) => val || "...........";

  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col pb-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #medical-record, #medical-record * { visibility: visible; }
          #medical-record {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <div className="w-8 h-8 bg-medi-teal rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-medi-teal transition-colors">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-medi-teal transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-medi-teal transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-medi-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-medi-teal/20">
                  <Check className="text-white w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Đã xác nhận!</h2>
                <p className="text-slate-500">Đang chuyển đến trang hướng dẫn...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-medi-teal animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Đang khởi tạo hồ sơ bệnh án</h2>
            <p className="text-slate-500">AI đang phân tích dữ liệu của bạn...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center bg-white rounded-3xl shadow-sm border border-slate-200">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 font-medium mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        ) : (
          <motion.div 
            id="medical-record"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-dashed border-slate-300 rounded-xl shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <div className="p-8 md:p-12 relative">
              <div className="flex justify-between items-start mb-10">
                <div className="text-left no-print">
                  <div className="h-10 w-40 bg-slate-50 rounded flex items-center justify-center border border-slate-100 mb-1">
                    <div className="flex gap-1 h-6 items-end">
                      {[2,4,1,3,2,5,1,4,2,3,1,5,2,4,1,3].map((h, i) => (
                        <div key={i} className="bg-slate-300 w-1" style={{ height: `${h * 4}px` }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Digital Medical Barcode</p>
                  <p className="text-[9px] text-slate-400 font-light tracking-tight">Ngày khám: {signedDate.split(' ')[0]}</p>
                </div>

                <div className="flex flex-col items-end gap-2 no-print">
                  <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-medium text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </button>
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-xs border border-slate-200"
                  >
                    <Shield className="w-3 h-3 text-medi-teal" />
                    Quyền riêng tư
                  </button>
                </div>
              </div>

              <div className="text-center mb-12 relative">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                  {isViewMode ? "HỒ SƠ CHẨN ĐOÁN ĐIỆN TỬ" : "HỒ SƠ BỆNH ÁN ĐIỆN TỬ SƠ BỘ"}
                </h1>
                <div className="w-24 h-1.5 bg-medi-teal mx-auto rounded-full mb-4" />
                <p className="text-slate-400 text-sm font-medium">
                  {isViewMode ? `Bác sĩ thực hiện: ${recordData.doctor}` : "Chi tiết hồ sơ bệnh án khởi tạo bởi Medi AI"}
                </p>
              </div>

              <section className="mb-12">
                <h2 className="text-base font-bold text-medi-teal mb-6 flex items-center gap-3">
                  <span className="bg-medi-teal text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">A</span>
                  THÔNG TIN HÀNH CHÍNH
                </h2>
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Họ và tên</p>
                      <p className="text-base font-bold text-slate-800 uppercase">{patientInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Giới tính</p>
                      <p className="text-base font-bold text-slate-800">{patientInfo.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Năm sinh</p>
                      <p className="text-base font-bold text-slate-800">{patientInfo.birthYear}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Mã BHYT</p>
                      <p className="text-base font-bold text-medi-teal tracking-tight">{patientInfo.bhytId}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-base font-bold text-medi-teal mb-6 flex items-center gap-3">
                  <span className="bg-medi-teal text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">B</span>
                  TRIỆU CHỨNG SƠ BỘ (BỆNH NHÂN CUNG CẤP)
                </h2>
                
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {summaryData?.symptoms.map((s, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 shadow-sm">
                        {s}
                      </span>
                    )) || <span className="text-slate-400 italic">Chưa ghi nhận triệu chứng</span>}
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-slate-700 leading-relaxed text-sm italic shadow-sm">
                    "{transcript || (isViewMode ? "Hồ sơ được khởi tạo từ dữ liệu khám lâm sàng." : "")}"
                  </div>

                  {images?.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-4">
                      {images.map((url: string, idx: number) => (
                        <div key={idx} className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                          <img src={url} className="w-full h-full object-cover" alt="Symptom" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-base font-bold text-medi-teal mb-6 flex items-center gap-3">
                  <span className="bg-medi-teal text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">C</span>
                  CHẨN ĐOÁN & ĐIỀU TRỊ (BÁC SĨ THỰC HIỆN)
                </h2>
                
                {isViewMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mạch (L/ph)</p>
                        <p className="text-lg font-bold text-slate-800">{summaryData?.vital_signs.pulse || "---"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nhiệt độ (oC)</p>
                        <p className="text-lg font-bold text-slate-800">{summaryData?.vital_signs.temperature || "---"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Huyết áp (mmHg)</p>
                        <p className="text-lg font-bold text-slate-800">{summaryData?.vital_signs.blood_pressure || "---"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nhịp thở (L/ph)</p>
                        <p className="text-lg font-bold text-slate-800">{summaryData?.vital_signs.respiratory_rate || "---"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-3">Kết luận chẩn đoán lâm sàng:</h3>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-medium">
                        {recordData.diagnosis}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-3">Đơn thuốc điều trị:</h3>
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                            <tr>
                              <th className="px-6 py-3">Tên thuốc</th>
                              <th className="px-6 py-3">Liều dùng & Cách dùng</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {recordData.meds.map((med: any, idx: number) => (
                              <tr key={idx} className="bg-white">
                                <td className="px-6 py-4 font-bold text-slate-800">{med.name}</td>
                                <td className="px-6 py-4 text-slate-500">{med.dosage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    {previousResultImages?.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {previousResultImages.map((url: string, idx: number) => (
                          <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                            <img src={url} className="w-full h-full object-cover" alt="Test Result" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-sm text-center py-4">Chưa ghi nhận kết quả xét nghiệm trước đây ...........</p>
                    )}
                  </div>
                )}
              </section>

              <div className="mt-12 p-4 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-800/80 leading-tight text-center uppercase font-bold tracking-tighter">
                "Thông tin này được tổng hợp bởi Medi AI nhằm phục vụ cho công tác khám chữa bệnh được hiệu quả, KHÔNG LÀ CHẨN ĐOÁN CUỐI CÙNG TỪ BÁC SĨ"
              </div>

              <div className="mt-16 flex flex-col md:flex-row items-end justify-between gap-8 border-t border-slate-100 pt-10">
                <div className="text-slate-300 text-[10px] font-mono">
                  Medi Record System v1.0
                </div>
                
                <div className="text-center min-w-[240px]">
                  <p className="text-[10px] text-slate-400 mb-4 uppercase tracking-[0.2em] font-bold">Chữ ký xác nhận của Bác sĩ</p>
                  <div className="font-signature text-4xl text-slate-900 mb-2 select-none">
                    Nguyễn Văn An
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">BS. NGUYỄN VĂN AN</p>
                    <p className="text-[10px] text-slate-500 font-mono">CCHN: 001234/HCM-CCHN</p>
                    <p className="text-[10px] text-slate-400 font-mono">Ngày thực hiện: {signedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!isViewMode && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
            <button 
              onClick={() => navigate(ROUTES.SYMPTOM_INPUT, { state: location.state })}
              className="flex items-center gap-2 px-8 py-3.5 text-slate-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Chỉnh sửa lại
            </button>
            <Button 
              onClick={handleConfirm}
              className="px-12 py-3.5 rounded-xl shadow-lg shadow-medi-teal/20 flex items-center gap-2"
              disabled={isLoading || !!error}
            >
              <CheckCircle className="w-5 h-5" />
              Xác nhận hồ sơ
            </Button>
          </div>
        )}

        {/* Privacy Modal */}
        <AnimatePresence>
          {showPrivacyModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPrivacyModal(false)}
                className="absolute inset-0 bg-slate-900/60"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Chi tiết hồ sơ khám bệnh</h2>
                    <p className="text-sm text-slate-400">{recordData?.date || signedDate}</p>
                  </div>
                  <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6">
                    <div className="flex items-center gap-3 mb-8">
                      <Lock className="w-5 h-5 text-medi-teal" />
                      <h3 className="text-lg font-bold text-slate-800">Cài đặt quyền riêng tư</h3>
                    </div>

                    <p className="text-sm text-slate-500 mb-6">Chọn ai có thể xem thông tin này</p>

                    <div className="space-y-4">
                      <button 
                        onClick={() => setPrivacyOption('me')}
                        className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${privacyOption === 'me' ? 'border-medi-teal bg-medi-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${privacyOption === 'me' ? 'bg-medi-teal text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Eye className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Chỉ mình tôi</p>
                          <p className="text-sm text-slate-500">Không ai khác có thể xem</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPrivacyOption('doctor')}
                        className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${privacyOption === 'doctor' ? 'border-medi-teal bg-medi-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${privacyOption === 'doctor' ? 'bg-medi-teal text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Bác sĩ và tôi</p>
                          <p className="text-sm text-slate-500">Bác sĩ có thể xem để chuẩn bị khám bệnh</p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="font-bold text-slate-600">Bảo mật:</span> Dữ liệu của bạn được mã hóa và tuân thủ các quy định về bảo mật y tế. Chỉ những người bạn cho phép mới có thể truy cập.
                      </p>
                    </div>
                  </div>

                  <Button onClick={() => setShowPrivacyModal(false)} className="w-full py-4 text-lg rounded-2xl">
                    Đóng
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  Search, 
  User, 
  Activity, 
  FileText, 
  Stethoscope, 
  ClipboardList,
  Maximize2,
  Minimize2,
  RotateCw,
  X,
  Printer,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  Calendar,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";
import { AutocompleteInput } from "../components/AutocompleteInput";

interface ImageLightBoxProps {
  url: string;
  onClose: () => void;
}

const ImageLightBox = ({ url, onClose }: ImageLightBoxProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 no-print"
    >
      <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
        <button 
          onClick={() => setScale(s => Math.min(s + 0.2, 3))}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setRotation(r => r + 90)}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <motion.div 
        drag
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <motion.img 
          src={url} 
          alt="Zoomed view"
          style={{ 
            scale, 
            rotate: rotation,
          }}
          className="max-w-full max-h-[85vh] rounded-lg shadow-2xl transition-transform duration-200"
        />
      </motion.div>
    </motion.div>
  );
};

export default function DoctorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Doctor's Assessment State
  const [vitals, setVitals] = useState({
    pulse: "82",
    temp: "37.2",
    bp: "120/80",
    resp: "18"
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [prescribedMeds, setPrescribedMeds] = useState<{name: string, dosage: string}[]>([]);

  // Mock Patient Data
  const patientData = {
    name: "ĐẶNG THỊ HẰNG NGA",
    gender: "Nữ",
    birthYear: "1995",
    bhytId: location.state?.bhytId || "GD 4 79 1234567890",
    recordId: "MED-2024-0812-001",
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    subjective: {
      symptoms: ["Đau họng", "Sốt nhẹ", "Mệt mỏi", "Ho khan"],
      transcript: "Tôi bị đau họng từ sáng qua, nuốt vướng và hơi đau tai. Có sốt nhẹ khoảng 37.5 độ. Đã uống thuốc hạ sốt nhưng chưa đỡ hẳn. Cảm thấy mệt mỏi và chán ăn.",
    },
    images: [
      "https://picsum.photos/seed/throat1/800/600",
      "https://picsum.photos/seed/throat2/800/600"
    ]
  };

  const addMedicine = (name: string) => {
    if (!prescribedMeds.find(m => m.name === name)) {
      setPrescribedMeds([...prescribedMeds, { name, dosage: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn" }]);
    }
  };

  const removeMedicine = (index: number) => {
    setPrescribedMeds(prescribedMeds.filter((_, i) => i !== index));
  };

  const updateDosage = (index: number, dosage: string) => {
    const newMeds = [...prescribedMeds];
    newMeds[index].dosage = dosage;
    setPrescribedMeds(newMeds);
  };

  const handleSaveAndPrint = () => {
    setIsSaving(true);
    // Simulate saving
    const recordData = {
      patient: patientData,
      vitals,
      diagnosis,
      prescribedMeds,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`record_${patientData.bhytId}`, JSON.stringify(recordData));

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      window.print();
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 print:bg-white print:pb-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-container { padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
          .medical-record { border: 2px solid #000 !important; padding: 2rem !important; }
          @page { margin: 1cm; }
        }
      `}} />

      <AnimatePresence>
        {selectedImage && (
          <ImageLightBox url={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>

      {/* Header - Hidden on print */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(ROUTES.DOCTOR_SEARCH)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-medi-teal rounded-full flex items-center justify-center">
                <Heart className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">Medi Doctor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="gap-2 shadow-lg shadow-medi-teal/20" onClick={handleSaveAndPrint} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              Hoàn tất & In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full print-container">
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 font-medium no-print"
          >
            <CheckCircle className="w-5 h-5" />
            Đã lưu hồ sơ chẩn đoán thành công!
          </motion.div>
        )}

        {/* Medical Record Card */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 md:p-12 shadow-xl shadow-slate-200/50 medical-record relative overflow-hidden">
          {/* Barcode & Meta */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex gap-6 items-start">
              <div className="text-left">
                <div className="h-10 w-40 bg-slate-100 rounded flex items-center justify-center border border-slate-200 mb-1">
                  <div className="flex gap-1 h-6 items-end">
                    {[2,4,1,3,2,5,1,4,2,3,1,5,2,4,1,3].map((h, i) => (
                      <div key={i} className="bg-slate-800 w-1" style={{ height: `${h * 4}px` }} />
                    ))}
                  </div>
                </div>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Digital Medical Barcode</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">ID: {patientData.recordId}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold">Ngày khám: {patientData.date}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Hồ sơ Chẩn đoán Điện tử</h1>
            <div className="w-24 h-1 bg-medi-teal mx-auto rounded-full" />
          </div>

          {/* A. Administrative */}
          <section className="mb-10">
            <h2 className="text-sm font-black text-medi-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-medi-teal text-white flex items-center justify-center text-[10px]">A</span>
              Thông tin hành chính
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Họ và tên</p>
                <p className="text-sm font-bold text-slate-800">{patientData.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Giới tính</p>
                <p className="text-sm font-bold text-slate-800">{patientData.gender}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Năm sinh</p>
                <p className="text-sm font-bold text-slate-800">{patientData.birthYear}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mã BHYT</p>
                <p className="text-sm font-mono font-bold text-medi-teal">{patientData.bhytId}</p>
              </div>
            </div>
          </section>

          {/* B. Preliminary Symptoms */}
          <section className="mb-10">
            <h2 className="text-sm font-black text-medi-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-medi-teal text-white flex items-center justify-center text-[10px]">B</span>
              Triệu chứng sơ bộ (Bệnh nhân cung cấp)
            </h2>
            <div className="space-y-4 p-6 border border-slate-100 rounded-2xl">
              <div className="flex flex-wrap gap-2">
                {patientData.subjective.symptoms.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{patientData.subjective.transcript}"
              </p>
            </div>
          </section>

          {/* C. Diagnosis & Treatment */}
          <section className="mb-10">
            <h2 className="text-sm font-black text-medi-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-medi-teal text-white flex items-center justify-center text-[10px]">C</span>
              Chẩn đoán & Điều trị (Bác sĩ thực hiện)
            </h2>
            
            <div className="space-y-8">
              {/* C1. Vitals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Mạch (l/ph)", key: "pulse" },
                  { label: "Nhiệt độ (°C)", key: "temp" },
                  { label: "Huyết áp (mmHg)", key: "bp" },
                  { label: "Nhịp thở (l/ph)", key: "resp" },
                ].map((v) => (
                  <div key={v.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{v.label}</label>
                    <input 
                      type="text"
                      value={vitals[v.key as keyof typeof vitals]}
                      onChange={(e) => setVitals({...vitals, [v.key]: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* C2. Diagnosis */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Kết luận chẩn đoán lâm sàng</label>
                <textarea 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Nhập chẩn đoán của bác sĩ..."
                  className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal outline-none transition-all leading-relaxed"
                />
              </div>

              {/* C3. Prescription */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 ml-1">Đơn thuốc chỉ định</label>
                  <div className="w-64 no-print">
                    <AutocompleteInput onSelect={addMedicine} />
                  </div>
                </div>

                <div className="space-y-3">
                  {prescribedMeds.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm">
                      Chưa có thuốc nào được chọn
                    </div>
                  ) : (
                    prescribedMeds.map((med, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-medi-teal/10 text-medi-teal flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-bold text-slate-800">{med.name}</p>
                          <input 
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateDosage(index, e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 focus:border-medi-teal outline-none transition-all"
                            placeholder="Hướng dẫn sử dụng..."
                          />
                        </div>
                        <button 
                          onClick={() => removeMedicine(index)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors no-print"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Symptom Images */}
          <section className="mb-12">
            <h2 className="text-sm font-black text-medi-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-medi-teal text-white flex items-center justify-center text-[10px]">4</span>
              Hình ảnh triệu chứng
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {patientData.images.map((url, i) => (
                <div 
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group"
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} className="w-full h-full object-cover" alt="Symptom" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print">
                    <Maximize2 className="text-white w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Doctor Signature */}
          <div className="pt-12 border-t border-slate-100 flex justify-end">
            <div className="text-center min-w-[250px]">
              <p className="text-[10px] text-slate-400 mb-8 uppercase tracking-[0.2em] font-bold">Chữ ký xác nhận của Bác sĩ</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-red-600 italic font-serif">Nguyễn Văn An</p>
                <p className="text-xs font-bold text-slate-900">BS. NGUYỄN VĂN AN</p>
                <p className="text-[10px] text-slate-500 font-mono">CCHN: 001234/HCM-CCHN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Hidden on print */}
        <div className="mt-12 flex items-center justify-between no-print">
          <button 
            onClick={() => navigate(ROUTES.DOCTOR_SEARCH)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại tra cứu
          </button>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="px-8" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> In hồ sơ
            </Button>
            <Button className="px-12 shadow-xl shadow-medi-teal/20" onClick={handleSaveAndPrint} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Hoàn tất & Lưu
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

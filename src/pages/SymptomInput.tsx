import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  ArrowLeft, 
  Mic, 
  Upload, 
  Info, 
  Home, 
  ChevronRight,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";

// --- Types for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// --- Helper for AI Prompt ---
export const generateSummaryPrompt = (text: string) => {
  return `Bạn là trợ lý y khoa. Hãy tóm tắt ngắn gọn tình trạng sau của bệnh nhân để bác sĩ đọc nhanh: ${text}`;
};

export default function SymptomInput() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [medicationImages, setMedicationImages] = useState<{ id: string; url: string }[]>([]);
  const [previousResultImages, setPreviousResultImages] = useState<{ id: string; url: string }[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "vi-VN";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript((prev) => {
            const combined = (prev + " " + finalTranscript).trim();
            return combined.charAt(0).toUpperCase() + combined.slice(1);
          });
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          setRecordingError("Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập trong cài đặt trình duyệt.");
        } else {
          setRecordingError("Đã có lỗi xảy ra khi ghi âm. Vui lòng thử lại.");
        }
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setRecordingError(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Start recording error:", err);
        setRecordingError("Không thể bắt đầu ghi âm.");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'symptom' | 'medication' | 'result') => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file as Blob)
      }));
      
      if (type === 'symptom') setImages(prev => [...prev, ...newImages]);
      else if (type === 'medication') setMedicationImages(prev => [...prev, ...newImages]);
      else if (type === 'result') setPreviousResultImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string, type: 'symptom' | 'medication' | 'result') => {
    if (type === 'symptom') setImages(prev => prev.filter(img => img.id !== id));
    else if (type === 'medication') setMedicationImages(prev => prev.filter(img => img.id !== id));
    else if (type === 'result') setPreviousResultImages(prev => prev.filter(img => img.id !== id));
  };

  const handleNext = () => {
    if (!transcript.trim() && images.length === 0) {
      alert("Vui lòng ghi âm hoặc tải hình ảnh triệu chứng.");
      return;
    }

    const data = {
      transcript,
      images: images.map(img => img.url),
      medicationImages: medicationImages.map(img => img.url),
      previousResultImages: previousResultImages.map(img => img.url),
      systemPrompt: `Trích xuất và tóm tắt hồ sơ y khoa theo các mục: Triệu chứng chính, Thời gian xuất hiện, Mức độ. Nguyên tắc: Không giới hạn độ dài tóm tắt, thông tin quan trọng phải giữ nguyên, không được tự ý bịa đặt thông tin nếu dữ liệu mờ hoặc thiếu - trường hợp đó ko cần làm gì, chỉ để nguyên câu nói`
    };

    navigate(ROUTES.AI_SUMMARY, { state: data });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <div className="w-10 h-10 bg-medi-teal rounded-full flex items-center justify-center">
              <Heart className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Medi</span>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Bước 1/3</p>
            <p className="text-sm font-bold text-slate-700">Chia sẻ tình trạng</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-medi-teal transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Chia sẻ tình trạng của bạn</h1>
          <p className="text-slate-500">Bạn có thể nói, tải hình ảnh hoặc kết hợp cả hai.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Voice Recording Box */}
          <Card className="flex flex-col h-full relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Ghi âm giọng nói</h2>
              <p className="text-sm text-slate-400">Nhấn và nói về tình trạng của bạn</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isRecording 
                    ? "bg-red-500 shadow-red-200 animate-pulse" 
                    : "bg-medi-teal shadow-medi-teal/20"
                }`}
              >
                <Mic className="text-white w-10 h-10" />
              </motion.button>
              
              {recordingError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recordingError}</span>
                </motion.div>
              )}
              
              <div className="mt-10 w-full min-h-[120px] bg-slate-50 rounded-2xl p-6 relative border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-medi-teal">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Đã ghi nhận</span>
                  </div>
                  <button onClick={() => setTranscript("")} className="text-slate-300 hover:text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {transcript || "Văn bản ghi âm sẽ hiển thị tại đây..."}
                </p>
              </div>
            </div>
          </Card>

          {/* Image Upload Box */}
          <Card className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Tải hình ảnh</h2>
              <p className="text-sm text-slate-400">Hình ảnh triệu chứng, đơn thuốc, kết quả khám</p>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group mb-6">
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'symptom')} />
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-medi-teal w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Nhấn để chọn hình ảnh</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, HEIC (tối đa 10MB)</p>
              </label>

              <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-100 group"
                    >
                      <img src={img.url} alt="Symptom" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(img.id, 'symptom')}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mb-12">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin bổ sung (tùy chọn)</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Medication Upload */}
              <div className="space-y-4">
                <label className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'medication')} />
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="text-medi-teal w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Chụp ảnh đơn thuốc/vỏ thuốc</p>
                  <p className="text-xs text-slate-400 mt-1">Tải lên nhiều ảnh nếu cần</p>
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {medicationImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-100 group">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(img.id, 'medication')} className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previous Results Upload */}
              <div className="space-y-4">
                <label className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'result')} />
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="text-medi-teal w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Chụp ảnh kết quả khám</p>
                  <p className="text-xs text-slate-400 mt-1">Kết quả xét nghiệm, chẩn đoán...</p>
                </label>

                <div className="flex flex-wrap gap-2">
                  {previousResultImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-100 group">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(img.id, 'result')} className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Note Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex gap-4 mb-12">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <AlertCircle className="text-blue-500 w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-900 mb-1">Lưu ý quan trọng</h4>
            <p className="text-xs text-blue-800/80 leading-relaxed">
              Thông tin này nhằm hỗ trợ chuẩn bị khám. Nếu triệu chứng trở nên nghiêm trọng hoặc bạn cảm thấy cần khám gấp, vui lòng đến cơ sở y tế ngay lập tức hoặc gọi cấp cứu <span className="font-bold">115</span>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white border-t border-slate-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm px-4 py-2 rounded-xl border border-slate-200"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          
          <Button 
            onClick={handleNext}
            className="px-10 py-3 rounded-xl shadow-lg shadow-medi-teal/20"
          >
            Tiếp theo
          </Button>
        </div>
      </footer>
    </div>
  );
}

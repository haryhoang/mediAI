import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Heart, 
  CheckCircle2, 
  Home, 
  Printer, 
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  Coffee,
  Activity,
  Moon,
  Wind
} from "lucide-react";
import { motion } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";

interface CareSuggestion {
  title: string;
  description: string;
}

export default function Completion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<CareSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { transcript, summaryData } = location.state || {};

  const checklistItems = [
    { id: "bhyt", label: "Thẻ BHYT", desc: "Mang theo thẻ bảo hiểm y tế gốc" },
    { id: "docs", label: "Giấy tờ liên quan", desc: "CMND/CCCD và sổ khám bệnh (nếu có)" },
    { id: "meds", label: "Thuốc đang dùng", desc: "Danh sách hoặc vỏ hộp thuốc bạn đang sử dụng" },
    { id: "results", label: "Kết quả khám trước", desc: "Kết quả xét nghiệm, chẩn đoán hình ảnh gần đây (nếu có)" },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const symptomsText = summaryData?.symptoms?.join(", ") || transcript || "triệu chứng mệt mỏi";
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Hãy dựa trên triệu chứng "${symptomsText}" để đưa ra 4 lời khuyên chăm sóc sức khỏe ban đầu ngắn gọn, thực tế cho bệnh nhân.`,
          config: {
            systemInstruction: "Bạn là trợ lý y khoa. Hãy đưa ra các lời khuyên chăm sóc sức khỏe ban đầu an toàn, không thay thế chẩn đoán bác sĩ. Trả về JSON mảng 4 đối tượng {title, description}.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          }
        });

        const data = JSON.parse(response.text);
        setSuggestions(data);
      } catch (err) {
        console.error("AI Error:", err);
        // Fallback suggestions
        setSuggestions([
          { title: "Nghỉ ngơi đầy đủ", description: "Tránh hoạt động nặng, ngủ đủ giấc để cơ thể phục hồi." },
          { title: "Uống đủ nước", description: "Uống ít nhất 2 lít nước mỗi ngày." },
          { title: "Theo dõi triệu chứng", description: "Ghi chú nếu triệu chứng thay đổi hoặc trở nên nghiêm trọng hơn." },
          { title: "Tránh căng thẳng", description: "Giữ tinh thần thoải mái, hít thở sâu." }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [transcript, summaryData]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (index: number) => {
    const icons = [Moon, Coffee, Activity, Wind];
    const Icon = icons[index % icons.length];
    return <Icon className="w-5 h-5 text-medi-teal" />;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <div className="w-8 h-8 bg-medi-teal rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Bước 3/3: Hoàn tất</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-medi-teal/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="text-medi-teal w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Hoàn tất!</h1>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Thông tin của bạn đã được lưu trữ an toàn. Dưới đây là hướng dẫn chăm sóc ban đầu và cách chuẩn bị cho buổi khám.
          </p>
        </div>

        {/* Care Suggestions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-medi-teal/10 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-medi-teal" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Gợi ý chăm sóc ban đầu</h2>
          </div>

          <Card className="p-2 space-y-2 border-slate-100 shadow-sm">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-medi-teal animate-spin mb-3" />
                <p className="text-xs text-slate-400">Đang tạo lời khuyên từ AI...</p>
              </div>
            ) : (
              suggestions.map((s, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl hover:bg-slate-50 transition-colors flex gap-4 items-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 mt-1">
                    {getIcon(idx)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </Card>
        </section>

        {/* Checklist */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Khi đi khám, bạn nên mang theo</h2>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <Card 
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 cursor-pointer transition-all border-slate-100 ${checkedItems[item.id] ? 'bg-slate-50 opacity-60' : 'hover:border-medi-teal/30 hover:shadow-md'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-5 h-5 text-medi-teal" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${checkedItems[item.id] ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Banner */}
        <div className="mb-12 bg-blue-50/80 border border-blue-100 rounded-2xl p-6 flex gap-4">
          <AlertCircle className="text-blue-500 w-6 h-6 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-blue-800/80">
            <p className="font-bold text-blue-900 mb-1">Lưu ý quan trọng</p>
            Thông tin này nhằm hỗ trợ chuẩn bị khám. Nếu triệu chứng trở nên nghiêm trọng hoặc bạn cảm thấy cần khám gấp, vui lòng đến cơ sở y tế gần nhất hoặc gọi cấp cứu 115.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full sm:w-auto px-8 py-3.5 text-slate-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            Về trang chủ
          </button>
          <Button 
            onClick={() => navigate(ROUTES.AI_SUMMARY, { state: location.state })}
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl shadow-lg shadow-medi-teal/20 flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Xem lại & In hồ sơ
          </Button>
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Thông tin của bạn đã được lưu trữ an toàn</p>
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Khi đến khám, bác sĩ sẽ có thể xem thông tin triệu chứng bạn đã chia sẻ thông qua mã BHYT để chuẩn bị tốt hơn cho buổi khám của bạn.
          </p>
        </div>
      </main>
    </div>
  );
}

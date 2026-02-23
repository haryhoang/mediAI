import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { ROUTES } from "../../constants/routes";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}


export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            
            {/* THAY THẾ Ở ĐÂY: Thay hình tròn trái tim bằng logo ảnh của em */}
            <img 
              src="/favicon.jpg" 
              alt="Medi Logo" 
              className="w-9 h-9 object-contain rounded-lg shadow-sm" 
            />
            
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi</span>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-medi-teal transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 pt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-500">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
};

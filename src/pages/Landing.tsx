import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Stethoscope, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Smartphone, 
  ChevronRight,
  Heart
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-bottom border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
          <div className="w-10 h-10 bg-medi-teal rounded-full flex items-center justify-center">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">Medi</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate(ROUTES.DOCTOR_SEARCH)}
            className="text-slate-600 hover:text-medi-teal font-medium transition-colors"
          >
            Dành cho bác sĩ
          </button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>Đăng nhập</Button>
            <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>Đăng ký</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
            Hãy để Medi cùng hiểu tình trạng sức khỏe của bạn
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
            Medi là trợ lý AI giúp ghi nhận tình trạng sức khỏe, hỗ trợ bác sĩ khám nhanh, chính xác hơn, lưu trữ dữ liệu an toàn và hiệu quả
          </p>
          
          <div className="flex flex-row gap-4 mb-10">
            <Button size="lg" className="flex-1 sm:flex-none px-8 h-14 text-base bg-medi-teal hover:bg-medi-teal-dark shadow-lg shadow-medi-teal/20" onClick={() => navigate(ROUTES.LOGIN)}>
              Bắt đầu chia sẻ
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 sm:flex-none px-8 h-14 text-base border-medi-teal text-medi-teal hover:bg-medi-teal/5"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Medi hoạt động như thế nào?
            </Button>
          </div>

          <ul className="space-y-4">
            {[
              "Hỗ trợ tạo thông tin sơ bộ trước khi đến khám",
              "Lưu trữ, theo dõi kết quả nhanh chóng, an toàn",
              "Hỗ trợ sau tái khám"
            ].map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-3 text-slate-600"
              >
                <CheckCircle2 className="text-medi-teal w-5 h-5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img 
              src="https://funix.edu.vn/wp-content/uploads/2023/11/tri-tue-nhantao-trong-y-te-2.jpg" 
              alt="Medi AI Assistant" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-medi-teal/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-medi-teal/5 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Stethoscope className="w-8 h-8 text-medi-teal" />,
      title: "Ghi nhận tình trạng sức khỏe",
      desc: "Nói hoặc tải hình ảnh về tình trạng sức khỏe. Medi sẽ ghi nhận một cách có hệ thống, an toàn, hiệu quả"
    },
    {
      icon: <Clock className="w-8 h-8 text-medi-teal" />,
      title: "Tiết kiệm thời gian",
      desc: "Bác sĩ xem trước thông tin, giảm thời gian hỏi và ghi chép trong buổi khám"
    },
    {
      icon: <FileText className="w-8 h-8 text-medi-teal" />,
      title: "Hướng dẫn chuẩn bị",
      desc: "Nhận gợi ý chăm sóc ban đầu và danh sách những gì cần mang khi đi khám"
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Medi giúp bạn chuẩn bị tốt hơn</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Chia sẻ triệu chứng trước, giúp bác sĩ hiểu rõ và khám bệnh nhanh chóng hơn.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} delay={i * 0.1}>
            <div className="w-16 h-16 bg-medi-teal/10 rounded-2xl flex items-center justify-center mb-6">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
            <p className="text-slate-600 leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      number: "1",
      title: "Đăng ký nhanh chóng",
      desc: "Thêm phương thức mã thẻ bảo hiểm y tế, giúp bạn tạo hồ sơ an toàn"
    },
    {
      number: "2",
      title: "Chia sẻ sức khỏe",
      desc: "Nói hoặc tải hình ảnh về tình trạng sức khỏe hiện tại của bạn"
    },
    {
      number: "3",
      title: "Nhận hướng dẫn, tra cứu và đặt lịch",
      desc: "Xem gợi ý chăm sóc và chuẩn bị cho buổi khám bệnh"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Quy trình đơn giản</h2>
        <p className="text-slate-600">Chỉ 3 bước để chuẩn bị cho buổi khám của bạn</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 relative">
        {/* Connector Line */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
        
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 bg-medi-teal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-medi-teal/20">
              {s.number}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const MobileDownload = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="w-16 h-16 bg-medi-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Smartphone className="w-8 h-8 text-medi-teal" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tải Medi trên điện thoại</h2>
        <p className="text-slate-600 mb-12">Ghi nhận thông tin nhanh chóng – mọi lúc, mọi nơi</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="transition-transform hover:scale-105">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-12" />
          </a>
          <a href="#" className="transition-transform hover:scale-105">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" />
          </a>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto bg-slate-50 rounded-[2.5rem] p-12 md:p-20 text-center border border-slate-100">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Sẵn sàng trải nghiệm</h2>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          Chia sẻ với chúng tôi để cùng chuẩn bị tốt hơn
        </p>
        <Button size="lg" className="px-12" onClick={() => navigate(ROUTES.REGISTER)}>Bắt đầu với Medi</Button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-100 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-medi-teal rounded-full flex items-center justify-center">
            <Heart className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-slate-800">Medi</span>
        </div>
        <p className="text-slate-400 text-sm">
          © 2026 Medi. Trợ lý sức khỏe AI của bác sĩ và bạn
        </p>
      </div>
    </footer>
  );
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Process />
        <MobileDownload />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

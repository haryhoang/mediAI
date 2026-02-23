import * as React from "react";
import { useState, useMemo } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay,
  eachDayOfInterval
} from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "./ui/Button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}

export const BookingModal = ({ isOpen, onClose, onConfirm, initialDate }: BookingModalProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Default to Feb 2026 based on prompt
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const today = startOfDay(new Date());

  // Reset current month to selected date's month when opening if initialDate exists
  React.useEffect(() => {
    if (isOpen && initialDate) {
      setCurrentMonth(startOfMonth(initialDate));
      setSelectedDate(initialDate);
    }
  }, [isOpen, initialDate]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;
    setSelectedDate(day);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      alert("Medi đã nhận thông tin đăng ký của bạn. Yêu cầu sẽ được hệ thống xử lý và phản hồi trong vòng 24h qua số điện thoại hoặc thông báo ứng dụng.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medi-teal/10 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-medi-teal" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Đăng ký lịch tái khám</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Body */}
          <div className="p-6">
            {/* Month Selector */}
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-lg font-bold text-slate-900 capitalize">
                Tháng {format(currentMonth, "MM, yyyy", { locale: vi })}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isPast = isBefore(day, today);
                const isToday = isSameDay(day, today);

                return (
                  <div key={idx} className="aspect-square flex items-center justify-center p-1">
                    <button
                      disabled={isPast}
                      onClick={() => handleDateClick(day)}
                      className={`
                        w-full h-full rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${!isCurrentMonth ? 'text-slate-200' : ''}
                        ${isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'}
                        ${isToday && !isSelected ? 'text-medi-teal ring-1 ring-medi-teal/30' : ''}
                        ${isSelected ? 'bg-medi-teal text-white shadow-lg shadow-medi-teal/30 scale-110' : ''}
                      `}
                    >
                      {format(day, "d")}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Notice */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Vui lòng chọn ngày từ hôm nay trở đi. Bệnh viện sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 shadow-lg shadow-medi-teal/20"
              disabled={!selectedDate}
              onClick={handleConfirm}
            >
              Xác nhận đặt lịch
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { LifeBuoy } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  reason?: string;
}

export const BlueScreenOfDeath: React.FC<Props> = ({ onDismiss, reason }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    sound.playGlitch();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.stopAll();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);

    return () => {
      sound.stopAll();
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [onDismiss]);

  const handleEscape = () => {
    sound.stopAll();
    sound.playSuccess();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0078d7] text-white font-mono p-6 md:p-12 flex flex-col justify-between select-none overflow-y-auto">
      {/* EMERGENCY ESCAPE BUTTON TOP RIGHT */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleEscape}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-2xl flex items-center gap-2 border-2 border-black transition-transform active:scale-95 cursor-pointer"
        >
          <LifeBuoy className="w-5 h-5 text-red-600 animate-spin" />
          CỨU NGUY: THA MẠNG (ESC)
        </button>
      </div>

      <div className="max-w-4xl space-y-6 my-auto pt-8">
        <div className="text-7xl md:text-9xl font-light">:(</div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          HỆ THỐNG NÃO BỘ CỦA BẠN ĐÃ GẶP SỰ CỐ VÀ CẦN TÁI KHỞI ĐỘNG.
        </h1>
        <p className="text-base md:text-xl text-blue-100">
          Vương Quốc Loser vừa phát hiện lỗi tràn bộ nhớ Dopamine do hành vi lướt mạng xã hội quá độ. Chúng tôi đang thu thập thông tin thất bại của bạn...
        </p>

        <div className="text-xl md:text-2xl font-semibold text-yellow-300">
          Đang kết xuất ký ức hối hận: {Math.min(progress, 100)}% hoàn tất
        </div>

        <div className="pt-6 border-t border-blue-400/50 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-white p-2 text-black text-center font-bold text-xs flex flex-col justify-center items-center shadow-lg shrink-0">
            <div className="border-2 border-black w-16 h-16 flex items-center justify-center text-center">
              LOSER
            </div>
            <span className="text-[9px] mt-1">TỈNH NGỘ ĐI</span>
          </div>

          <div className="space-y-1 text-xs md:text-sm text-blue-200">
            <p className="font-bold text-white">MÃ DỪNG: CRITICAL_DOPAMINE_BRAINROT_EXCEPTION</p>
            <p className="font-bold text-white">NGUYÊN NHÂN: {reason || 'LƯỚT TIKTOK / CHỐNG ĐỐI KỶ LUẬT'}</p>
            <p>Trạng thái: Nhấn nút bên dưới hoặc phím ESC để quay lại cuộc sống thực.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-blue-400/30 gap-4 mt-6">
        <span className="text-xs text-blue-200">Nhấn ESC hoặc nút bên cạnh để khôi phục màn hình ngay lập tức.</span>
        <button
          onClick={handleEscape}
          className="w-full sm:w-auto px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wider uppercase rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
        >
          [ TÔI ĐÃ TỈNH NGỘ - CHO TÔI LÀM VIỆC TIẾP ]
        </button>
      </div>
    </div>
  );
};

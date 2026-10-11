import React, { useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { AlertOctagon, Siren, Volume2, ShieldAlert, X, LifeBuoy } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  reason?: string;
}

export const SirenAlarmOverlay: React.FC<Props> = ({ onDismiss, reason }) => {
  const [pledgeTyped, setPledgeTyped] = useState('');
  const TARGET_PLEDGE = 'Tôi xin thề sẽ tắt điện thoại';

  useEffect(() => {
    // Play siren sound on mount
    sound.playSiren(4000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.stopAll();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      sound.stopAll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss]);

  const handleBypass = () => {
    sound.stopAll();
    sound.playSuccess();
    onDismiss();
  };

  const handleAutoFill = () => {
    setPledgeTyped(TARGET_PLEDGE);
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/95 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto animate-pulse">
      {/* Crimson Strobe Border */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-red-600 animate-ping opacity-30" />

      {/* TOP EMERGENCY ESCAPE HATCH */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleBypass}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-2xl flex items-center gap-2 border-2 border-black transition-transform active:scale-95 cursor-pointer"
        >
          <LifeBuoy className="w-5 h-5 text-red-600 animate-spin" />
          CỨU NGUY: THA MẠNG (ESC)
        </button>
      </div>

      <div className="relative z-10 max-w-xl w-full bg-black/95 border-4 border-red-600 rounded-3xl p-6 md:p-8 shadow-[0_0_90px_rgba(239,68,68,0.9)] text-white text-center space-y-5 my-auto">
        <div className="flex items-center justify-center gap-3">
          <Siren className="w-12 h-12 text-red-500 animate-bounce" />
          <AlertOctagon className="w-16 h-16 text-yellow-400 animate-pulse" />
          <Siren className="w-12 h-12 text-red-500 animate-bounce" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-full mb-2">
            MÃ ĐỎ: CÒI BÁO ĐỘNG KỶ LUẬT
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-red-400">
            BÁO ĐỘNG ĐỎ CẤP ĐỘ 5!
          </h2>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {reason || 'Người dùng bị bắt quả tang vừa rời khỏi chế độ tập trung hoặc lướt app cấm!'}
          </p>
        </div>

        <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center justify-between text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Điều kiện giải trừ:
            </span>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] underline text-amber-300 hover:text-white"
            >
              [Tự động điền hộ]
            </button>
          </div>
          <p className="text-xs text-gray-300">
            Gõ dòng cam kết danh dự:
          </p>
          <div 
            onClick={handleAutoFill}
            className="font-mono bg-black p-2.5 rounded-lg text-yellow-300 text-sm border border-yellow-500/50 cursor-pointer hover:bg-zinc-900 transition-colors font-semibold"
            title="Bấm để điền nhanh"
          >
            "{TARGET_PLEDGE}"
          </div>
          <input
            type="text"
            value={pledgeTyped}
            onChange={(e) => setPledgeTyped(e.target.value)}
            placeholder="Gõ hoặc bấm vào dòng trên để điền..."
            className="w-full bg-black/80 border border-red-500 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 font-mono text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => sound.playSiren(2500)}
            className="flex-1 px-4 py-2.5 bg-red-950 hover:bg-red-900 border border-red-700 rounded-xl text-xs font-bold text-red-300 flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" /> Hú còi thêm
          </button>
          <button
            onClick={handleBypass}
            className="flex-1 px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer animate-pulse"
          >
            TÔI ĐÃ HỐI HẬN • TẮT CÒI NGAY
          </button>
        </div>
      </div>
    </div>
  );
};

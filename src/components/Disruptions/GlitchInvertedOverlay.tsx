import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { RotateCw, Zap, ShieldCheck, LifeBuoy } from 'lucide-react';

interface Props {
  onDismiss: () => void;
}

export const GlitchInvertedOverlay: React.FC<Props> = ({ onDismiss }) => {
  const [numA] = useState(Math.floor(Math.random() * 9) + 4);
  const [numB] = useState(Math.floor(Math.random() * 8) + 3);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const expectedAnswer = numA * numB;

  useEffect(() => {
    sound.playGlitch();

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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === expectedAnswer) {
      sound.playSuccess();
      onDismiss();
    } else {
      sound.playBuzzer();
      setErrorMsg(`Chưa đúng! Đáp án gợi ý: ${expectedAnswer}. Thử lại hoặc bấm nút Tha Mạng!`);
    }
  };

  const handleEmergencyEscape = () => {
    sound.stopAll();
    sound.playSuccess();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-green-400 font-mono p-4 md:p-6 flex items-center justify-center backdrop-blur-md overflow-y-auto">
      {/* CRT Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px]" />

      {/* EMERGENCY ESCAPE BUTTON TOP RIGHT */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleEmergencyEscape}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-2xl flex items-center gap-2 border-2 border-black transition-transform active:scale-95 cursor-pointer"
        >
          <LifeBuoy className="w-5 h-5 text-red-600 animate-spin" />
          CỨU NGUY: THA MẠNG (ESC)
        </button>
      </div>

      <div className="relative z-10 max-w-lg w-full bg-zinc-950 border-2 border-green-500 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(34,197,94,0.4)] text-center space-y-5 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/60 border border-green-400 rounded-full text-xs font-bold uppercase tracking-widest text-green-300">
          <Zap className="w-4 h-4 animate-bounce" />
          HỆ THỐNG TRỌNG LỰC BỊ ĐẢO NGHỊCH
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          CỨU NGUY Ý THỨC: KÍCH HOẠT THÙY TRÁN!
        </h3>

        <p className="text-zinc-300 text-xs md:text-sm">
          Giải phép tính sau hoặc bấm "Tha Mạng" để khôi phục lại màn hình:
        </p>

        <div className="py-4 px-6 bg-zinc-900 border border-green-500/40 rounded-2xl text-4xl font-black text-yellow-300 tracking-wider">
          {numA} × {numB} = ?
        </div>

        {errorMsg && (
          <p className="text-red-400 text-xs font-bold animate-pulse">{errorMsg}</p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="number"
            autoFocus
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Nhập đáp án..."
            className="w-full bg-black border-2 border-green-500/70 rounded-xl p-3 text-center text-2xl font-bold text-green-300 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleEmergencyEscape}
              className="flex-1 px-4 py-3 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              🏳️ Đầu hàng • Tha mạng cho tao
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" /> Mở khoá hệ thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

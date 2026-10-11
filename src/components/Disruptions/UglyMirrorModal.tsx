import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../utils/audio';
import { Camera, Skull, Flame, EyeOff, RefreshCcw, LifeBuoy } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  onPenancePaid?: () => void;
}

export const UglyMirrorModal: React.FC<Props> = ({ onDismiss, onPenancePaid }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [shameTitle, setShameTitle] = useState('Khuôn mặt của kẻ vô công rỗi nghề lúc này');

  useEffect(() => {
    sound.playJumpscare();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const titles = [
      'GƯƠNG CHIẾU YÊU: MẮT THÂM QUẦNG VÌ TIKTOK',
      'CHÂN DUNG KẺ VỪA PHÍ PHẠM 2 TIẾNG CUỘC ĐỜI',
      'DOPAMINE ZOMBIE: NÃO BỘ ĐANG TEO LẠI',
      'ĐÂY LÀ NGƯỜI TỪNG HỨA: "NĂM NAY SẼ GIÀU"!',
      'GƯƠNG MẶT ĐẮNG CAY CỦA SỰ TRÌ HOÃN'
    ];
    setShameTitle(titles[Math.floor(Math.random() * titles.length)]);

    let localStream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((s) => {
          localStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable:', err);
          setCameraError('Không thể mở camera. Nhưng gương phản chiếu tâm hồn cho thấy bạn cần làm việc ngay!');
        });
    } else {
      setCameraError('Trình duyệt không hỗ trợ camera.');
    }

    return () => {
      sound.stopAll();
      window.removeEventListener('keydown', handleKeyDown);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    sound.stopAll();
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    sound.playSuccess();
    if (onPenancePaid) onPenancePaid();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl overflow-y-auto">
      {/* EMERGENCY ESCAPE BUTTON TOP RIGHT */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-2xl flex items-center gap-2 border-2 border-black transition-transform active:scale-95 cursor-pointer"
        >
          <LifeBuoy className="w-5 h-5 text-red-600 animate-spin" />
          CỨU NGUY: THA MẠNG (ESC)
        </button>
      </div>

      <div className="max-w-2xl w-full bg-zinc-950 border-4 border-amber-500 rounded-3xl p-6 md:p-8 text-center text-white relative shadow-[0_0_90px_rgba(245,158,11,0.5)] my-auto">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-black font-black uppercase text-xs md:text-sm tracking-wider rounded-full mb-4 shadow">
          <Skull className="w-4 h-4" />
          {shameTitle}
          <Flame className="w-4 h-4 text-red-600 animate-bounce" />
        </div>

        {/* Video / Mirror Frame */}
        <div className="relative mx-auto w-full max-w-lg aspect-4/3 bg-zinc-900 border-4 border-dashed border-red-500 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
          {cameraError ? (
            <div className="p-6 text-center space-y-3">
              <EyeOff className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
              <p className="text-amber-200 text-sm font-semibold">{cameraError}</p>
              <div className="w-24 h-24 mx-auto rounded-full bg-zinc-800 border-4 border-amber-500 flex items-center justify-center text-5xl">
                🤡
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1] transition-transform duration-500"
              style={{ transform: `scaleX(-1) scale(${zoomLevel})` }}
            />
          )}

          <div className="absolute top-4 left-4 bg-red-600/90 text-white font-black text-[11px] px-2.5 py-1 rounded shadow uppercase tracking-wider rotate-[-5deg]">
            CẢNH BÁO: KHUÔN MẶT LƯỜI BIẾNG
          </div>
          <div className="absolute bottom-4 right-4 bg-amber-500/90 text-black font-black text-[11px] px-2.5 py-1 rounded shadow uppercase tracking-wider rotate-[3deg]">
            DOPAMINE: QUÁ TẢI (99%)
          </div>
        </div>

        <p className="mt-4 text-xs md:text-sm text-zinc-300 italic max-w-md mx-auto">
          "Hãy nhìn thẳng vào đôi mắt mỏi mệt trong gương. Đứng dậy rửa mặt rồi bắt tay vào việc ngay!"
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setZoomLevel((z) => (z >= 1.4 ? 1.0 : z + 0.15));
              sound.playJumpscare();
            }}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl text-xs font-bold text-zinc-200 flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Zoom thêm vào mặt
          </button>
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-black text-sm tracking-wide rounded-xl shadow-lg transition-transform active:scale-95 uppercase cursor-pointer"
          >
            Tôi đã tỉnh mắt - Tha mạng cho tôi!
          </button>
        </div>
      </div>
    </div>
  );
};

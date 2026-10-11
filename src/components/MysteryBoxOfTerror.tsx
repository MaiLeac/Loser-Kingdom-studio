import React, { useState } from 'react';
import { UserStats, DisruptionType, PunishmentItem } from '../types';
import { sound } from '../utils/audio';
import { 
  Box, 
  Sparkles, 
  Camera, 
  Siren, 
  Monitor, 
  RotateCcw, 
  Skull, 
  Flame, 
  AlertOctagon,
  Dices
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onSelectDisruption: (type: DisruptionType) => void;
  onAddPunishment: (punishment: PunishmentItem) => void;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
}

export const MysteryBoxOfTerror: React.FC<Props> = ({
  stats,
  onSelectDisruption,
  onAddPunishment,
  onUpdateStats,
}) => {
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [boxResult, setBoxResult] = useState<any | null>(null);

  const handleRollMysteryBox = async () => {
    setIsOpeningBox(true);
    setBoxResult(null);
    sound.playGlitch();

    try {
      const res = await fetch('/api/generate-punishment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offense: 'Trì hoãn công việc và nghiện dopamine video ngắn',
          severity: 'severe',
        }),
      });

      const data = await res.json();
      const pun = data.punishment;
      setBoxResult(pun);
      setIsOpeningBox(false);
      sound.playJumpscare();

      const newPunishment: PunishmentItem = {
        id: `pun-${Date.now()}`,
        title: pun.title,
        description: pun.description,
        category: pun.category || 'physical',
        severity: 'severe',
        completed: false,
        assignedAt: Date.now(),
        source: 'ai_generated',
      };

      onAddPunishment(newPunishment);
      onUpdateStats((prev) => ({
        ...prev,
        shamePoints: prev.shamePoints + 5,
      }));
    } catch (err) {
      setIsOpeningBox(false);
      const fallback: PunishmentItem = {
        id: `pun-${Date.now()}`,
        title: 'Chống đẩy sám hối 30 cái',
        description: 'Đứng dậy ngay, hít đất 30 cái không nghỉ để thức tỉnh trí óc!',
        category: 'physical',
        severity: 'severe',
        completed: false,
        assignedAt: Date.now(),
        source: 'system',
      };
      setBoxResult(fallback);
      onAddPunishment(fallback);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500 rounded-full text-xs font-black uppercase text-amber-300 mb-3">
            <Box className="w-4 h-4 text-amber-400" />
            HỘP QUỶ DỮ & KHO VŨ KHÍ TÂM LÝ
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Kho Kích Hoạt Cú Sốc Tâm Lý (Visual & Audio Shocks)
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2">
            Khi ý chí lười biếng bắt đầu lấn át, hãy tự dùng những liều thuốc sốc này để kéo bản thân trở về thực tại ngay tức khắc.
          </p>
        </div>
      </div>

      {/* Manual Trigger Buttons for Shocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Ugly Mirror */}
        <div className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/80 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-base">Gương Chiếu Yêu</h3>
            <p className="text-xs text-zinc-400">
              Bật webcam zoom cận cảnh vào khuôn mặt mệt mỏi, chán chường của bạn kèm các sticker sỉ nhục.
            </p>
          </div>
          <button
            onClick={() => onSelectDisruption('ugly_mirror')}
            className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs rounded-xl transition-all shadow"
          >
            Kích Hoạt Gương
          </button>
        </div>

        {/* 2. Red Siren Alarm */}
        <div className="bg-zinc-950 border border-zinc-800 hover:border-red-500/80 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <Siren className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-extrabold text-white text-base">Còi Báo Động Đỏ</h3>
            <p className="text-xs text-zinc-400">
              Âm thanh còi báo động không kích rền vang kết hợp nhấp nháy đỏ chói mắt, buộc bạn phải gõ cam kết.
            </p>
          </div>
          <button
            onClick={() => onSelectDisruption('siren_alarm')}
            className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs rounded-xl transition-all shadow"
          >
            Hú Còi Khẩn Cấp
          </button>
        </div>

        {/* 3. Blue Screen (BSOD) */}
        <div className="bg-zinc-950 border border-zinc-800 hover:border-blue-500/80 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-base">Màn Hình Xanh Chết Chóc</h3>
            <p className="text-xs text-zinc-400">
              Giả lập crash hệ điều hành não bộ với mã lỗi "CRITICAL_DOPAMINE_OVERLOAD" và tiếng nổ glitch.
            </p>
          </div>
          <button
            onClick={() => onSelectDisruption('blue_screen')}
            className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs rounded-xl transition-all shadow"
          >
            Giả Lập Crash Não
          </button>
        </div>

        {/* 4. Glitch & Inverted Orientation */}
        <div className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/80 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-base">Đảo Nghịch Hệ Thống</h3>
            <p className="text-xs text-zinc-400">
              Hiệu ứng ma trận nhiễu loạn sóng và câu đố toán nhân chia bất ngờ để đánh thức vùng não tư duy.
            </p>
          </div>
          <button
            onClick={() => onSelectDisruption('glitch_inverted')}
            className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-xs rounded-xl transition-all shadow"
          >
            Đảo Không Gian
          </button>
        </div>
      </div>

      {/* The Mystery Box of Agony (Roll Random Torture) */}
      <div className="bg-gradient-to-br from-zinc-950 via-red-950/40 to-black border-2 border-dashed border-red-500/60 rounded-3xl p-6 md:p-10 text-center space-y-6 shadow-2xl">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border-2 border-red-500 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            🎁
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            VÒNG QUAY HÀNH XÁC: MỞ HỘP QUỶ DỮ
          </h3>
          <p className="text-xs md:text-sm text-zinc-400">
            Dám đối mặt với số phận không? Bấm nút để AI Gemini chế tác ngẫu nhiên một hình phạt kỷ luật thích đáng cho bạn ngay lúc này!
          </p>
        </div>

        <button
          onClick={handleRollMysteryBox}
          disabled={isOpeningBox}
          className="px-8 py-4 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:opacity-90 disabled:opacity-50 text-black font-black uppercase text-sm tracking-wider rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center gap-3 mx-auto transition-transform active:scale-95 cursor-pointer"
        >
          {isOpeningBox ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Đang Mở Hộp Quỷ Dữ...
            </>
          ) : (
            <>
              <Dices className="w-5 h-5" />
              Rút Thăm Hình Phạt Ngẫu Nhiên
            </>
          )}
        </button>

        {boxResult && (
          <div className="max-w-lg mx-auto bg-zinc-950 border-2 border-red-500 rounded-2xl p-5 text-left space-y-2 animate-bounce">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-red-600 text-white">
              HÌNH PHẠT VỪA ĐƯỢC CHỈ ĐỊNH:
            </span>
            <h4 className="text-lg font-black text-yellow-300">{boxResult.title}</h4>
            <p className="text-xs text-zinc-300">{boxResult.description}</p>
            <p className="text-[10px] text-zinc-500 italic">
              Đã được thêm vào danh sách hình phạt cần thi hành của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

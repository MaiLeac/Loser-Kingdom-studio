import React, { useState } from 'react';
import { UserStats, InfractionLog } from '../types';
import { sound } from '../utils/audio';
import { 
  Flame, 
  Skull, 
  Volume2, 
  MessageSquareWarning, 
  Send, 
  Sparkles, 
  AlertCircle,
  ShieldAlert,
  Shuffle
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onAddLog: (log: InfractionLog) => void;
  onTriggerDisruption: (reason: string) => void;
  onAssignPunishment: (title: string, desc: string) => void;
}

const APPS_LIST = [
  { name: 'TikTok', icon: '🎵', tag: 'Chúa tể clip 15s' },
  { name: 'Facebook Reels', icon: '📱', tag: 'Đống rác tin giả' },
  { name: 'Shopee Săn Sale', icon: '🛒', tag: 'Cháy túi vì mã 10k' },
  { name: 'YouTube Shorts', icon: '▶️', tag: 'Vuốt mãi không dừng' },
  { name: 'Instagram', icon: '📸', tag: 'Ngắm người ta giàu sang' },
  { name: 'Game Gacha / Liên Quân', icon: '🎮', tag: 'Nạp tiền mua ảo ảnh' },
  { name: 'Nằm ườn / Ngủ nướng', icon: '🛌', tag: 'Bại não vì lười' },
];

const EXCUSE_PRESETS = [
  'Tao chỉ định lướt 5 phút giải lao thôi mà...',
  'Hôm nay não tao mệt quá, để sáng mai làm bù!',
  'Đang đợi cảm hứng sáng tạo nó đến...',
  'Shopee đang có mã giảm giá 50k không xem thì tiếc!',
  'Còn tận 3 ngày nữa mới tới hạn nộp, lo gì!',
];

export const SavageRoastChamber: React.FC<Props> = ({
  stats,
  onUpdateStats,
  onAddLog,
  onTriggerDisruption,
  onAssignPunishment,
}) => {
  const [selectedApp, setSelectedApp] = useState('TikTok');
  const [excuse, setExcuse] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentRoast, setCurrentRoast] = useState<string | null>(
    'Hãy thú nhận tội lỗi của mày đi! Tao đang chờ để vả cho mày tỉnh ngộ đây!'
  );
  const [hasReceivedRoast, setHasReceivedRoast] = useState(false);

  const handleRoastSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    sound.playGlitch();

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetApp: selectedApp,
          taskName: 'Công việc quan trọng đang bị bỏ xó',
          excuse: excuse || 'Không có lý do, chỉ là vô kỷ luật',
          failureStreak: stats.failedTasks + 1,
          loserRank: stats.rank,
        }),
      });

      const data = await res.json();
      setCurrentRoast(data.roast);
      setHasReceivedRoast(true);
      setLoading(false);

      // Play dramatic jumpscare sound
      sound.playJumpscare();

      // Read out loud with Vietnamese TTS
      if (data.roast) {
        sound.speakRoast(data.roast);
      }

      // Deduct HP, add shame points
      onUpdateStats((prev) => ({
        ...prev,
        hp: Math.max(0, prev.hp - 10),
        shamePoints: prev.shamePoints + 8,
        dopamineAddiction: Math.min(100, prev.dopamineAddiction + 12),
      }));

      // Log infraction
      onAddLog({
        id: `infraction-${Date.now()}`,
        timestamp: Date.now(),
        appAbused: selectedApp,
        reason: excuse || 'Tự thú lướt vô bổ',
        roastReceived: data.roast,
        hpLost: 10,
      });
    } catch (err) {
      setLoading(false);
      setCurrentRoast('Server cũng bất lực trước độ lười của mày! Đứng dậy mà chống đẩy ngay!');
    }
  };

  const handleSpeakAgain = () => {
    if (currentRoast) {
      sound.speakRoast(currentRoast);
    }
  };

  const handleTriggerShock = () => {
    onTriggerDisruption(`Bị sỉ nhục bởi Ma Vương vì nghiện ${selectedApp}`);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 border-2 border-red-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 border border-red-500 rounded-full text-xs font-black uppercase text-red-400">
              <Skull className="w-4 h-4 text-red-500" />
              ĐẠI MA VƯƠNG SỈ NHỤC (AI ROAST ENGINE)
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Khu Vực "Tự Vả" & Nhận Án Phạt Đắng Lòng
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Nơi bóc trần những lời ngụy biện rẻ tiền. Đại Ma Vương sẽ dùng AI Gemini đâm thẳng vào tim đen của bạn bằng những câu sỉ nhục sắc lẹm nhất!
            </p>
          </div>

          <div className="w-24 h-24 rounded-2xl bg-zinc-950 border-2 border-red-600 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse">
            👹
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Confession Form */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-red-400 block mb-2">
              1. Mày vừa phí thời gian vào cái thứ rác rưởi nào?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APPS_LIST.map((app) => (
                <button
                  key={app.name}
                  onClick={() => setSelectedApp(app.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedApp === app.name
                      ? 'bg-red-950 border-red-500 text-white shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span className="text-lg">{app.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{app.name}</span>
                    <span className="text-[10px] text-zinc-500">{app.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-red-400 block mb-2">
              2. Lý do nguỵ biện của mày hôm nay là gì?
            </label>
            <textarea
              rows={3}
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
              placeholder="Gõ lời ngụy biện của bạn hoặc chọn mẫu bên dưới..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />

            {/* Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {EXCUSE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setExcuse(p)}
                  className="text-[11px] bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-2 py-1 rounded-lg transition-colors"
                >
                  "{p.slice(0, 28)}..."
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleRoastSubmit()}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ma Vương Đang Mài Dao Chửi...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                Lãnh Một Vả Thẳng Vào Mặt
              </>
            )}
          </button>
        </div>

        {/* Right Column: Roast Output Box */}
        <div className="lg:col-span-7 bg-zinc-950 border-2 border-red-600/70 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 uppercase">
                <MessageSquareWarning className="w-4 h-4 text-red-500" />
                Án Sỉ Nhục Chính Thức Từ AI
              </span>
              {hasReceivedRoast && (
                <button
                  onClick={handleSpeakAgain}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] font-bold text-zinc-300 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Nghe Lại Giọng Nói
                </button>
              )}
            </div>

            {/* Savage Speech Quote */}
            <div className="relative py-4">
              <span className="absolute -top-4 -left-2 text-6xl text-red-950 font-serif select-none pointer-events-none">
                “
              </span>
              <p className="text-base md:text-xl font-bold text-red-100 leading-relaxed font-sans relative z-10">
                {currentRoast}
              </p>
            </div>
          </div>

          {/* Action Consequences */}
          <div className="pt-6 border-t border-zinc-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTriggerShock}
                className="flex-1 py-3 bg-red-950 hover:bg-red-900 border border-red-700 rounded-xl text-xs font-black uppercase text-red-300 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                Bật Báo Động Sốc Ngay!
              </button>
              <button
                onClick={() => {
                  onAssignPunishment(
                    'Chống đẩy sám hối vì lướt ' + selectedApp,
                    'Tự giác rời máy tính và thực hiện 30 cái chống đẩy hoặc plank 1 phút.'
                  );
                  sound.playSuccess();
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Gán Hình Phạt Chuộc Lỗi
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 text-center">
              Mỗi lần nhận một vả sỉ nhục, Sinh Lực (HP) của bạn sẽ bị trừ 10 điểm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

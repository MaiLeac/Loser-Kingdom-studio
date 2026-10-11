import React from 'react';
import { PunishmentItem, UserStats } from '../types';
import { COMMUNITY_TORTURE_VAULT } from '../utils/storage';
import { sound } from '../utils/audio';
import { 
  Flame, 
  CheckCircle, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Users,
  Dumbbell
} from 'lucide-react';

interface Props {
  punishments: PunishmentItem[];
  stats: UserStats;
  onCompletePunishment: (id: string) => void;
  onAddPunishment: (item: PunishmentItem) => void;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
}

export const CrowdsourcedTortureChamber: React.FC<Props> = ({
  punishments,
  stats,
  onCompletePunishment,
  onAddPunishment,
  onUpdateStats,
}) => {
  const pendingPunishments = punishments.filter((p) => !p.completed);
  const completedPunishments = punishments.filter((p) => p.completed);

  const handleClaimCommunityPenance = (penance: (typeof COMMUNITY_TORTURE_VAULT)[0]) => {
    const newPun: PunishmentItem = {
      id: `penance-${Date.now()}`,
      title: penance.title,
      description: penance.description,
      category: penance.category,
      severity: penance.severity,
      completed: false,
      assignedAt: Date.now(),
      source: 'community',
    };
    onAddPunishment(newPun);
    sound.playSuccess();
  };

  const handleMarkDone = (id: string) => {
    sound.playSuccess();
    onCompletePunishment(id);
    onUpdateStats((prev) => ({
      ...prev,
      hp: Math.min(100, prev.hp + 15),
      xp: prev.xp + 40,
      penancesPaid: prev.penancesPaid + 1,
      dopamineAddiction: Math.max(0, prev.dopamineAddiction - 10),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500 rounded-full text-xs font-black uppercase text-rose-300 mb-2">
              <Users className="w-4 h-4 text-rose-400" />
              PHÒNG TRA TẤN & SÁM HỐI CỘNG ĐỒNG
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Khu Chuộc Lỗi Bằng Hành Động Thực Tế
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Chọn một hành động nhẹ, phù hợp với tình trạng hiện tại. Có thể nghỉ thay vì nhận thử thách.
            </p>
          </div>

        </div>

        <p className="text-xs text-zinc-400 mt-4">Kho hiện chỉ nhận thử thách đã duyệt. Đề xuất tự do cần được kiểm duyệt trước khi áp dụng.</p>
      </div>

      {/* Pending Penances Debt */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-white text-base">
              Án Phạt Bạn Đang Nợ Chưa Thi Hành ({pendingPunishments.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Đã hoàn thành: {stats.penancesPaid} án
          </span>
        </div>

        {pendingPunishments.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950/60 border border-zinc-800/60 rounded-xl space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">Bạn hiện không nợ án phạt nào!</p>
            <p className="text-xs text-zinc-400">
              Hãy tiếp tục giữ vững kỷ luật trong Phòng Biệt Giam.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingPunishments.map((pun) => (
              <div
                key={pun.id}
                className="p-4 bg-zinc-950 border border-red-500/40 rounded-xl flex flex-col justify-between space-y-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        pun.severity === 'hell'
                          ? 'bg-purple-900 text-purple-300'
                          : pun.severity === 'severe'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-amber-900 text-amber-300'
                      }`}
                    >
                      {pun.severity === 'hell' ? 'Địa ngục' : pun.severity === 'severe' ? 'Nghiêm khắc' : 'Nhẹ'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(pun.assignedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-yellow-300">{pun.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{pun.description}</p>
                </div>

                <button
                  onClick={() => handleMarkDone(pun.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-xs rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow"
                >
                  <CheckCircle className="w-4 h-4" />
                  Đã Thi Hành Xong (+15 HP)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Torture Repository (Click to Adopt) */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-white text-base">
            Kho thử thách đã duyệt
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMUNITY_TORTURE_VAULT.map((penance, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 rounded-xl flex flex-col justify-between space-y-3 transition-colors"
            >
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block mb-1">
                  • {penance.category}
                </span>
                <h4 className="font-bold text-sm text-white">{penance.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{penance.description}</p>
              </div>
              <button
                onClick={() => handleClaimCommunityPenance(penance)}
                className="w-full py-2 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 text-xs font-bold rounded-lg transition-colors uppercase"
              >
                Nhận Hình Phạt Này
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

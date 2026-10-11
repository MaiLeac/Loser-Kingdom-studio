import React from 'react';
import { InfractionLog, UserStats } from '../types';
import { ShieldAlert, Trash2, Calendar, Award, AlertOctagon, Flame } from 'lucide-react';

interface Props {
  logs: InfractionLog[];
  stats: UserStats;
  onClearLogs: () => void;
  onResetAllData: () => void;
}

export const InfractionCrimeLog: React.FC<Props> = ({
  logs,
  stats,
  onClearLogs,
  onResetAllData,
}) => {
  return (
    <div className="space-y-6">
      {/* Crime Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] text-zinc-400 uppercase font-bold block">Tổng Lần Phạm Tội</span>
          <span className="text-2xl md:text-3xl font-black text-red-500 font-mono mt-1 block">
            {stats.failedTasks + stats.quarantineBreaches + logs.length}
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] text-zinc-400 uppercase font-bold block">Đào Tẩu Khỏi Biệt Giam</span>
          <span className="text-2xl md:text-3xl font-black text-amber-500 font-mono mt-1 block">
            {stats.quarantineBreaches}
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] text-zinc-400 uppercase font-bold block">Điểm Nhục Nhã</span>
          <span className="text-2xl md:text-3xl font-black text-purple-400 font-mono mt-1 block">
            {stats.shamePoints}
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] text-zinc-400 uppercase font-bold block">Nhiệm Vụ Chiến Thắng</span>
          <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono mt-1 block">
            {stats.completedTasks}
          </span>
        </div>
      </div>

      {/* Crime Log Timeline */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-white text-base">Hồ Sơ Tiền Án & Nhật Ký Phạm Tội</h3>
          </div>
          <div className="flex gap-2">
            {logs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xoá Nhật Ký
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn reset toàn bộ tiến trình về số 0?')) {
                  onResetAllData();
                }
              }}
              className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-bold transition-colors"
            >
              Reset Vương Quốc
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Chưa có tiền án nào được ghi nhận. Bạn đang giữ kỷ luật tốt hoặc chưa thú nhận tội lỗi!
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2 hover:border-red-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      {log.appAbused}
                    </span>
                    <span className="text-zinc-400">"{log.reason}"</span>
                  </div>
                  <span className="text-zinc-500 font-mono">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border-l-2 border-red-500 text-xs text-red-200 italic">
                  “{log.roastReceived}”
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Trừ: <strong className="text-red-400">-{log.hpLost} HP</strong></span>
                  {log.punishmentAssigned && (
                    <span className="text-amber-400 font-semibold">Hình phạt: {log.punishmentAssigned}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

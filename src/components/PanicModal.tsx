import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { AlertOctagon, Flame, X, Siren, Camera } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSubmitConfession: (app: string, excuse: string) => void;
}

export const PanicModal: React.FC<Props> = ({ onClose, onSubmitConfession }) => {
  const [selectedApp, setSelectedApp] = useState('TikTok');
  const [excuse, setExcuse] = useState('');

  const APPS = ['TikTok', 'Facebook Reels', 'Shopee Săn Sale', 'YouTube Shorts', 'Instagram', 'Game Gacha'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitConfession(selectedApp, excuse || 'Vừa lướt vô bổ không kiểm soát');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="max-w-md w-full bg-zinc-950 border-2 border-red-600 rounded-3xl p-6 text-white space-y-5 shadow-[0_0_60px_rgba(239,68,68,0.5)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase">
            <AlertOctagon className="w-5 h-5 animate-bounce" />
            Tự Thú Tội Lỗi Cấp Tốc
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Mày vừa lỡ tay mở app nào?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APPS.map((app) => (
                <button
                  type="button"
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    selectedApp === app
                      ? 'bg-red-950 border-red-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Lời thú tội / Ngụy biện:
            </label>
            <input
              type="text"
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
              placeholder="VD: Chỉ định xem 1 clip nhưng bay mất 40 phút..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Flame className="w-4 h-4" />
              Nộp Mình Cho Đại Ma Vương Vả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import { 
  Heart, 
  Flame, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  ShieldAlert, 
  Trophy, 
  Zap,
  Activity
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onPanicClick: () => void;
  onResetStats?: () => void;
}

export const HeaderHUD: React.FC<Props> = ({ stats, onPanicClick }) => {
  const [muted, setMuted] = React.useState(sound.getMuted());

  const toggleSound = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) sound.playSuccess();
  };

  const hpPercent = Math.max(0, Math.min(100, stats.hp));
  const hpColor =
    hpPercent > 60 ? 'bg-emerald-500' : hpPercent > 30 ? 'bg-amber-500' : 'bg-red-600 animate-pulse';

  const dopamineColor =
    stats.dopamineAddiction > 70
      ? 'text-red-400 border-red-500/50 bg-red-950/40'
      : stats.dopamineAddiction > 40
      ? 'text-amber-400 border-amber-500/50 bg-amber-950/40'
      : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';

  return (
    <header className="md:sticky md:top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Rank */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-xl shadow-lg border border-red-400/40">
              💀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Vương Quốc Loser
                </h1>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
                  v2.0 Hardcore
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-yellow-400" />
                Cấp {stats.level} • <span className="text-yellow-300 font-bold">{stats.rank}</span>
              </p>
            </div>
          </div>

          {/* Quick Sound Toggle on mobile */}
          <button
            onClick={toggleSound}
            title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>
        </div>

        {/* Meters: HP, Dopamine, XP */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center flex-wrap">
          {/* Health Points */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <Heart className={`w-4 h-4 ${hpPercent <= 30 ? 'text-red-500 animate-ping' : 'text-red-400'}`} />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] gap-2 font-mono">
                <span className="text-zinc-400">Sinh Lực (HP)</span>
                <span className="font-bold">{hpPercent}/100</span>
              </div>
              <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full ${hpColor} transition-all duration-500`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dopamine Toxicity Meter */}
          <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl ${dopamineColor}`}>
            <Flame className="w-4 h-4 animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider">Độc Tố Dopamine</span>
              <span className="text-xs font-mono font-black">{stats.dopamineAddiction}% {stats.dopamineAddiction > 75 ? '(Nguy cấp!)' : ''}</span>
            </div>
          </div>

          {/* Discipline Streak & XP */}
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-zinc-400 block text-[10px]">Chuỗi Kỷ Luật</span>
              <span className="text-amber-300 font-bold">{stats.streakDays} ngày • {stats.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Confession / Panic Button */}
          <button
            onClick={onPanicClick}
            className="flex-1 md:flex-initial px-3.5 py-2 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-red-400/40 cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            Tao Vừa Lướt Tóp Tóp!
          </button>

          {/* Desktop Sound Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh'}
            className="hidden md:flex p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

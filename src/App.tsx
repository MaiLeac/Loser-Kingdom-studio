/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  UserStats, 
  TaskItem, 
  PunishmentItem, 
  InfractionLog, 
  DisruptionType 
} from './types';
import { 
  loadStats, 
  saveStats, 
  loadTasks, 
  saveTasks, 
  loadPunishments, 
  savePunishments, 
  loadLogs, 
  saveLogs, 
  calculateRank,
  INITIAL_STATS,
  INITIAL_TASKS,
  INITIAL_PUNISHMENTS
} from './utils/storage';
import { isReviewedPunishment } from './utils/safePunishments';
import { sound } from './utils/audio';
import { applyReviewPenalty, ExcuseReview, isExcuseReview, ReasonType, reviewExcuse } from './utils/excusePolicy';

import { HeaderHUD } from './components/HeaderHUD';
import { QuarantineTimer } from './components/QuarantineTimer';
import { SavageRoastChamber } from './components/SavageRoastChamber';
import { MysteryBoxOfTerror } from './components/MysteryBoxOfTerror';
import { CrowdsourcedTortureChamber } from './components/CrowdsourcedTortureChamber';
import { InfractionCrimeLog } from './components/InfractionCrimeLog';
import { PanicModal } from './components/PanicModal';



import { 
  Lock, 
  Flame, 
  Box, 
  Users, 
  FileText, 
  Skull,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [tasks, setTasks] = useState<TaskItem[]>(loadTasks);
  const [punishments, setPunishments] = useState<PunishmentItem[]>(loadPunishments);
  const [logs, setLogs] = useState<InfractionLog[]>(loadLogs);

  const [activeTab, setActiveTab] = useState<'quarantine' | 'roast' | 'mystery_box' | 'torture' | 'logs'>('quarantine');
  const [activeDisruption, setActiveDisruption] = useState<DisruptionType>('none');
  const [disruptionReason, setDisruptionReason] = useState<string>('');
  const [showPanicModal, setShowPanicModal] = useState<boolean>(false);
  const [recoveryMode, setRecoveryMode] = useState(() => localStorage.getItem('vql_recovery_mode') === '1');
  const recoveryRef = useRef(recoveryMode);
  recoveryRef.current = recoveryMode;
  const [reviewNotice, setReviewNotice] = useState<ExcuseReview | null>(null);
  useEffect(() => { localStorage.setItem('vql_recovery_mode', recoveryMode ? '1' : '0'); }, [recoveryMode]);


  // Auto-save stats, recalculate rank
  useEffect(() => {
    const updatedRank = calculateRank(stats.xp, stats.hp, stats.completedTasks);
    if (updatedRank !== stats.rank) {
      setStats((prev) => ({ ...prev, rank: updatedRank }));
    }
    saveStats(stats);
  }, [stats]);

  // Auto-save tasks
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Auto-save punishments
  useEffect(() => {
    savePunishments(punishments);
  }, [punishments]);

  // Auto-save logs
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const dismissDisruption = () => {
    sound.stopAll();
    setActiveDisruption('none');
  };

  // Global ESC key listener to exit ANY punishment instantly
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissDisruption();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Trigger random psychological shock
  const handleTriggerRandomDisruption = (reason: string) => {
    if (recoveryMode) return;
    const disruptions: DisruptionType[] = ['blue_screen', 'siren_alarm', 'ugly_mirror', 'glitch_inverted'];
    const pick = disruptions[Math.floor(Math.random() * disruptions.length)];
    setDisruptionReason(reason);
    setActiveDisruption(pick);
  };

  // Complete a punishment
  const handleCompletePunishment = (id: string) => {
    setPunishments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: true, completedAt: Date.now() } : p))
    );
  };

  const handleReviewResult = (review: ExcuseReview, reason: string, appAbused: string) => {
    if (recoveryRef.current && review.decision !== 'rest') return;
    setReviewNotice(review);
    sound.stopAll();
    if (review.decision === 'rest') {
      recoveryRef.current = true;
      setRecoveryMode(true);
      setTasks(prev => prev.map(task => task.status === 'in_quarantine' ? {...task, status: 'pending'} : task));
      setActiveDisruption('none');
    }
    // Asking for rest gives no XP, HP recovery, task completion or streak reset.
    setStats(prev => applyReviewPenalty(prev, review));
    setLogs(prev => [{
      id: `review-${crypto.randomUUID()}`, timestamp: Date.now(), appAbused,
      reason: review.decision === 'rest' ? 'Xin nghỉ theo nhóm lý do đã chọn (không lưu chi tiết sức khỏe)' : reason,
      roastReceived: review.roast, hpLost: review.hpPenalty,
      outcome: review.decision, reasonCategory: review.category,
    }, ...prev]);
  };

  const handlePanicConfession = async (appAbused: string, excuse: string, reasonType: ReasonType) => {
    const protectedReview = reviewExcuse(excuse, reasonType);
    if (protectedReview.decision !== 'accountability') {
      handleReviewResult(protectedReview, excuse, appAbused);
      setShowPanicModal(false);
      return;
    }
    try {
      const res = await fetch('/api/roast', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ targetApp: appAbused, excuse, reasonType }),
      });
      const data: unknown = await res.json();
      if (!res.ok || !isExcuseReview(data)) throw new Error('Invalid review response');
      // Local protection also prevents an outdated server response penalizing illness.
      const local = reviewExcuse(excuse, reasonType);
      handleReviewResult(local.decision !== 'accountability' ? local : data, excuse, appAbused);
      setShowPanicModal(false);
    } catch {
      setReviewNotice({decision: 'clarify', category: 'auto', hpPenalty: 0, isFallback: true,
        roast: 'Chưa kết nối được hệ thống. Không phạt vì lỗi mạng; bạn vẫn có thể bấm nghỉ ngay.'});
      // A protected request must work even without the server.
      const local = reviewExcuse(excuse, reasonType);
      if (local.decision === 'rest') handleReviewResult(local, excuse, appAbused);
      setShowPanicModal(false);
    }
  };

  const handleRequestRest = () => handleReviewResult(reviewExcuse('Cần nghỉ và hồi phục', 'recovery'), '', 'Phiên tập trung');
  const restCount = logs.filter(log => log.outcome === 'rest' && log.timestamp >= Date.now() - 7 * 86400000).length;

  const handleResetAllData = () => {
    setRecoveryMode(false);
    setReviewNotice(null);
    setStats(INITIAL_STATS);
    setTasks(INITIAL_TASKS);
    setPunishments(INITIAL_PUNISHMENTS);
    setLogs([]);
    sound.playSuccess();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Status & HP HUD */}
      <HeaderHUD
        stats={stats}
        onPanicClick={() => setShowPanicModal(true)}
      />

      {(reviewNotice || recoveryMode) && <section className="mx-auto w-full max-w-7xl px-4 py-4" aria-live="polite">
        <div className="bg-zinc-900 border border-emerald-700 rounded-2xl p-4 space-y-3">
          <h2 className="font-bold">{recoveryMode ? 'Đang nghỉ / hồi phục · không phạt' : reviewNotice?.decision === 'clarify' ? 'Cần làm rõ · chưa phạt' : 'Nhắc kỷ luật · −10 HP'}</h2>
          {reviewNotice && <p className="text-sm text-zinc-200">{reviewNotice.roast}</p>}
          {recoveryMode && <p className="text-xs text-zinc-400">Nhiệm vụ chưa hoàn thành; không cộng XP hay hồi HP. {restCount >= 3 ? `Bạn đã xin nghỉ ${restCount} lần trong 7 ngày. Khi sẵn sàng, cân nhắc giảm khối lượng hoặc thời lượng; đây không phải kết luận bạn nói dối.` : 'Không cần chứng minh tình trạng sức khỏe.'}</p>}
          <div className="flex gap-3 flex-wrap">
            {recoveryMode && <button className="bg-emerald-600 rounded-lg px-4 py-2 text-sm font-bold" onClick={() => {setRecoveryMode(false); setReviewNotice(null); setActiveTab('quarantine');}}>Tôi sẵn sàng quay lại</button>}
            {reviewNotice && <button className="bg-zinc-800 rounded-lg px-4 py-2 text-sm" onClick={() => setReviewNotice(null)}>Đóng thông báo</button>}
          </div>
        </div>
      </section>}

      {/* Global Floating Emergency Rescue Button when any disruption is active */}
      {activeDisruption !== 'none' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={dismissDisruption}
            className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs md:text-sm rounded-2xl shadow-[0_0_35px_rgba(250,204,21,0.9)] flex items-center gap-2 border-2 border-black transition-transform active:scale-95 cursor-pointer animate-bounce"
          >
            <span>🚨 CỨU NGUY: THA MẠNG (ESC)</span>
          </button>
        </div>
      )}

      {activeDisruption !== 'none' && <div role="dialog" aria-label="Nhắc tập trung" className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
        <div className="p-6 rounded-2xl bg-zinc-900 max-w-md space-y-4">
          <h2 className="font-bold">Tạm dừng và chọn bước tiếp theo</h2>
          <p>{disruptionReason}</p>
          <button onClick={dismissDisruption} className="bg-zinc-700 rounded-lg p-3">Đóng nhắc nhở</button>
          <button onClick={handleRequestRest} className="bg-emerald-700 rounded-lg p-3 ml-2">Xin nghỉ · không phạt</button>
        </div>
      </div>}

      {/* Quick Panic Modal */}
      {showPanicModal && (
        <PanicModal
          onClose={() => setShowPanicModal(false)}
          onSubmitConfession={handlePanicConfession}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 no-scrollbar">
          <button
            onClick={() => {
              sound.playSuccess();
              setActiveTab('quarantine');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'quarantine'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Phòng Biệt Giam (Focus)
          </button>

          <button
            onClick={() => {
              sound.stopAll();
              setActiveTab('roast');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'roast'
                ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Flame className="w-4 h-4 text-red-500" />
            Ma Vương Sỉ Nhục (AI Roast)
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              setActiveTab('mystery_box');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'mystery_box'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Box className="w-4 h-4 text-purple-300" />
            Hộp thử thách
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              setActiveTab('torture');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'torture'
                ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-4 h-4 text-rose-300" />
            Phòng Tra Tấn ({punishments.filter((p) => !p.completed).length})
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              setActiveTab('logs');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4 text-zinc-400" />
            Nhật ký ({logs.length})
          </button>
        </nav>

        {/* Tab 1: Quarantine Timer & Anti-Cheat */}
        {activeTab === 'quarantine' && (
          <QuarantineTimer
            tasks={tasks}
            stats={stats}
            onUpdateStats={updater => setStats(prev => recoveryRef.current ? prev : updater(prev))}
            onUpdateTasks={setTasks}
            onTriggerDisruption={handleTriggerRandomDisruption}
            recoveryMode={recoveryMode}
            onRequestRest={handleRequestRest}
          />
        )}

        {/* Tab 2: Savage Roast Chamber (Gemini) */}
        {activeTab === 'roast' && (
          <SavageRoastChamber
            stats={stats}
            onReviewResult={handleReviewResult}
            recoveryMode={recoveryMode}
            onRequestRest={handleRequestRest}
          />
        )}

        {recoveryMode && (activeTab === 'mystery_box' || activeTab === 'torture') && <p className="p-6 bg-zinc-900 rounded-xl">Các thử thách tạm dừng trong lúc nghỉ. Khi đủ sức, bấm “Tôi sẵn sàng quay lại”.</p>}

        {/* Tab 3: Mystery Box of Terror & Shocks */}
        {activeTab === 'mystery_box' && !recoveryMode && (
          <MysteryBoxOfTerror
            stats={stats}
            onSelectDisruption={(type) => {
              setDisruptionReason('Kích hoạt thử thách sốc trực tiếp từ Hộp Quỷ Dữ');
              setActiveDisruption(type);
            }}
            onAddPunishment={(pun) => { if (!recoveryRef.current && isReviewedPunishment(pun)) setPunishments((prev) => [pun, ...prev]); }}
            onUpdateStats={updater => setStats(prev => recoveryRef.current ? prev : updater(prev))}
          />
        )}

        {/* Tab 4: Crowdsourced Torture Chamber */}
        {activeTab === 'torture' && !recoveryMode && (
          <CrowdsourcedTortureChamber
            punishments={punishments}
            stats={stats}
            onCompletePunishment={handleCompletePunishment}
            onAddPunishment={(pun) => { if (!recoveryRef.current && isReviewedPunishment(pun)) setPunishments((prev) => [pun, ...prev]); }}
            onUpdateStats={updater => setStats(prev => recoveryRef.current ? prev : updater(prev))}
          />
        )}

        {/* Tab 5: Infraction Crime Log */}
        {activeTab === 'logs' && (
          <InfractionCrimeLog
            logs={logs}
            stats={stats}
            onClearLogs={() => setLogs([])}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>
          Vương Quốc Loser • Kỷ Luật Thép • Chống Nghiện Dopamine & Trì Hoãn
        </p>
        <p className="text-[10px] text-zinc-700 mt-1">
          Hệ thống chạy $0 Cost trên nền tảng Gemini 3.8 Flash • Local-First Architecture
        </p>
      </footer>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { sound } from './utils/audio';

import { HeaderHUD } from './components/HeaderHUD';
import { QuarantineTimer } from './components/QuarantineTimer';
import { SavageRoastChamber } from './components/SavageRoastChamber';
import { MysteryBoxOfTerror } from './components/MysteryBoxOfTerror';
import { CrowdsourcedTortureChamber } from './components/CrowdsourcedTortureChamber';
import { InfractionCrimeLog } from './components/InfractionCrimeLog';
import { PanicModal } from './components/PanicModal';

// Disruption Overlays
import { BlueScreenOfDeath } from './components/Disruptions/BlueScreenOfDeath';
import { SirenAlarmOverlay } from './components/Disruptions/SirenAlarmOverlay';
import { UglyMirrorModal } from './components/Disruptions/UglyMirrorModal';
import { GlitchInvertedOverlay } from './components/Disruptions/GlitchInvertedOverlay';

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
    const disruptions: DisruptionType[] = ['blue_screen', 'siren_alarm', 'ugly_mirror', 'glitch_inverted'];
    const pick = disruptions[Math.floor(Math.random() * disruptions.length)];
    setDisruptionReason(reason);
    setActiveDisruption(pick);
  };

  // Assign a punishment to user
  const handleAssignPunishment = (title: string, desc: string) => {
    const newPun: PunishmentItem = {
      id: `pun-${Date.now()}`,
      title,
      description: desc,
      category: 'physical',
      severity: 'severe',
      completed: false,
      assignedAt: Date.now(),
      source: 'ai_generated',
    };
    setPunishments((prev) => [newPun, ...prev]);
  };

  // Complete a punishment
  const handleCompletePunishment = (id: string) => {
    setPunishments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: true, completedAt: Date.now() } : p))
    );
  };

  // Handle confession submission from Panic button
  const handlePanicConfession = async (appAbused: string, excuse: string) => {
    setShowPanicModal(false);
    setActiveTab('roast');
    sound.playGlitch();

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetApp: appAbused,
          taskName: 'Nhiệm vụ bị bỏ lơ',
          excuse,
          failureStreak: stats.failedTasks + 1,
          loserRank: stats.rank,
        }),
      });
      const data = await res.json();

      setStats((prev) => ({
        ...prev,
        hp: Math.max(0, prev.hp - 15),
        shamePoints: prev.shamePoints + 10,
        dopamineAddiction: Math.min(100, prev.dopamineAddiction + 15),
      }));

      const newLog: InfractionLog = {
        id: `panic-${Date.now()}`,
        timestamp: Date.now(),
        appAbused,
        reason: excuse,
        roastReceived: data.roast,
        hpLost: 15,
        punishmentAssigned: 'Chống đẩy sám hối',
      };
      setLogs((prev) => [newLog, ...prev]);

      // Trigger siren shock overlay!
      setDisruptionReason(`Tự thú phạm tội lướt ${appAbused}`);
      setActiveDisruption('siren_alarm');
    } catch {
      setActiveDisruption('siren_alarm');
    }
  };

  const handleResetAllData = () => {
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

      {/* Disruption Overlays */}
      {activeDisruption === 'blue_screen' && (
        <BlueScreenOfDeath
          reason={disruptionReason}
          onDismiss={dismissDisruption}
        />
      )}
      {activeDisruption === 'siren_alarm' && (
        <SirenAlarmOverlay
          reason={disruptionReason}
          onDismiss={dismissDisruption}
        />
      )}
      {activeDisruption === 'ugly_mirror' && (
        <UglyMirrorModal
          onDismiss={dismissDisruption}
          onPenancePaid={() => {
            setStats((prev) => ({ ...prev, shamePoints: prev.shamePoints + 2 }));
          }}
        />
      )}
      {activeDisruption === 'glitch_inverted' && (
        <GlitchInvertedOverlay
          onDismiss={dismissDisruption}
        />
      )}

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
              sound.playGlitch();
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
            Hộp Quỷ Dữ (Shocks)
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
            Bảng Tiền Án ({logs.length})
          </button>
        </nav>

        {/* Tab 1: Quarantine Timer & Anti-Cheat */}
        {activeTab === 'quarantine' && (
          <QuarantineTimer
            tasks={tasks}
            stats={stats}
            onUpdateStats={setStats}
            onUpdateTasks={setTasks}
            onTriggerDisruption={handleTriggerRandomDisruption}
          />
        )}

        {/* Tab 2: Savage Roast Chamber (Gemini) */}
        {activeTab === 'roast' && (
          <SavageRoastChamber
            stats={stats}
            onUpdateStats={setStats}
            onAddLog={(log) => setLogs((prev) => [log, ...prev])}
            onTriggerDisruption={handleTriggerRandomDisruption}
            onAssignPunishment={handleAssignPunishment}
          />
        )}

        {/* Tab 3: Mystery Box of Terror & Shocks */}
        {activeTab === 'mystery_box' && (
          <MysteryBoxOfTerror
            stats={stats}
            onSelectDisruption={(type) => {
              setDisruptionReason('Kích hoạt thử thách sốc trực tiếp từ Hộp Quỷ Dữ');
              setActiveDisruption(type);
            }}
            onAddPunishment={(pun) => setPunishments((prev) => [pun, ...prev])}
            onUpdateStats={setStats}
          />
        )}

        {/* Tab 4: Crowdsourced Torture Chamber */}
        {activeTab === 'torture' && (
          <CrowdsourcedTortureChamber
            punishments={punishments}
            stats={stats}
            onCompletePunishment={handleCompletePunishment}
            onAddPunishment={(pun) => setPunishments((prev) => [pun, ...prev])}
            onUpdateStats={setStats}
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

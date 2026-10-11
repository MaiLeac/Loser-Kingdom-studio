import React, { useState, useEffect, useRef } from 'react';
import { TaskItem, UserStats, AntiCheatType } from '../types';
import { sound } from '../utils/audio';
import { AntiCheatModal } from './AntiCheatModal';
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Clock, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Radio, 
  ShieldX, 
  Sparkles,
  Zap
} from 'lucide-react';

interface Props {
  tasks: TaskItem[];
  stats: UserStats;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onUpdateTasks: (tasks: TaskItem[]) => void;
  onTriggerDisruption: (reason: string) => void;
}

export const QuarantineTimer: React.FC<Props> = ({
  tasks,
  stats,
  onUpdateStats,
  onUpdateTasks,
  onTriggerDisruption,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [targetDuration, setTargetDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [breachCount, setBreachCount] = useState<number>(0);
  const [lastBreachWarning, setLastBreachWarning] = useState<string | null>(null);
  const [strictTabWatch, setStrictTabWatch] = useState<boolean>(true);
  const lastBreachTimeRef = useRef<number>(0);

  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('work');
  const [newTaskAntiCheat, setNewTaskAntiCheat] = useState<AntiCheatType>('typing_oath');

  // Anti-cheat verification modal
  const [verifyingTask, setVerifyingTask] = useState<TaskItem | null>(null);

  // Tab switch & visibility breach watcher with cooldown
  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (isActive && strictTabWatch && document.hidden) {
        // Enforce 25 seconds cooldown between alerts so user isn't spammed endlessly
        if (now - lastBreachTimeRef.current < 25000) {
          return;
        }
        lastBreachTimeRef.current = now;

        sound.playSiren(3000);
        setBreachCount((prev) => prev + 1);
        const warning = `CẢNH BÁO: Bị phát hiện rời tab lúc ${new Date().toLocaleTimeString()}! Trừ 15 HP!`;
        setLastBreachWarning(warning);

        // Deduct HP, increase breach count
        onUpdateStats((prev) => ({
          ...prev,
          hp: Math.max(0, prev.hp - 15),
          quarantineBreaches: prev.quarantineBreaches + 1,
          dopamineAddiction: Math.min(100, prev.dopamineAddiction + 10),
          shamePoints: prev.shamePoints + 5,
        }));

        onTriggerDisruption('Đào tẩu khỏi Phòng Biệt Giam (Chuyển tab khác trong giờ làm việc)');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, strictTabWatch, onUpdateStats, onTriggerDisruption]);

  // Timer countdown interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            sound.playSuccess();
            // Prompt anti-cheat verification for current task
            const curr = tasks.find((t) => t.id === selectedTaskId);
            if (curr) setVerifyingTask(curr);
            return 0;
          }
          if (prev % 60 === 0) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, tasks, selectedTaskId]);

  const startQuarantine = () => {
    if (!selectedTaskId) {
      sound.playBuzzer();
      return;
    }
    sound.playSuccess();
    setTimeLeft(targetDuration * 60);
    setIsActive(true);
    setBreachCount(0);
    setLastBreachWarning(null);

    // Update task status
    onUpdateTasks(
      tasks.map((t) => (t.id === selectedTaskId ? { ...t, status: 'in_quarantine' } : t))
    );
  };

  const abortQuarantine = () => {
    sound.playBuzzer();
    setIsActive(false);
    onUpdateStats((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - 10),
      failedTasks: prev.failedTasks + 1,
      shamePoints: prev.shamePoints + 10,
    }));
    onTriggerDisruption('Bỏ cuộc giữa chừng trong Phòng Biệt Giam!');
  };

  const handleManualComplete = () => {
    const curr = tasks.find((t) => t.id === selectedTaskId);
    if (curr) {
      setVerifyingTask(curr);
    }
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      targetMinutes: targetDuration,
      category: newTaskCategory,
      antiCheat: newTaskAntiCheat,
      status: 'pending',
      createdAt: Date.now(),
    };

    onUpdateTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
    setNewTaskTitle('');
    setShowAddForm(false);
    sound.playSuccess();
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(tasks.find((t) => t.id !== id)?.id || '');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6">
      {/* Verification Modal if opened */}
      {verifyingTask && (
        <AntiCheatModal
          task={verifyingTask}
          onSuccess={(proof, aiScore, aiFeedback) => {
            onUpdateTasks(
              tasks.map((t) =>
                t.id === verifyingTask.id
                  ? {
                      ...t,
                      status: 'completed',
                      completedAt: Date.now(),
                      proofSubmitted: proof,
                      aiScore: aiScore || 90,
                      aiFeedback: aiFeedback || 'Thành công!',
                    }
                  : t
              )
            );
            onUpdateStats((prev) => ({
              ...prev,
              hp: Math.min(100, prev.hp + 20),
              xp: prev.xp + 50,
              completedTasks: prev.completedTasks + 1,
              streakDays: prev.streakDays + 1,
              dopamineAddiction: Math.max(0, prev.dopamineAddiction - 15),
            }));
            setVerifyingTask(null);
            setIsActive(false);
          }}
          onFail={(reason) => {
            setVerifyingTask(null);
            onUpdateStats((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - 20),
              failedTasks: prev.failedTasks + 1,
              shamePoints: prev.shamePoints + 15,
            }));
            onTriggerDisruption(`Gian lận thất bại: ${reason}`);
          }}
          onCancel={() => setVerifyingTask(null)}
        />
      )}

      {/* Hero Timer Isolation Cockpit */}
      <div className={`relative rounded-3xl p-6 md:p-10 border-2 transition-all overflow-hidden ${
        isActive 
          ? 'bg-zinc-950 border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.25)]' 
          : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
      }`}>
        {/* Active Scanlines Background if in lockdown */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Status Badge & Tab Breach Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border shadow ${
              isActive 
                ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}>
              {isActive ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                  PHÒNG BIỆT GIAM ĐANG KHÓA CHẶT
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  CHẾ ĐỘ SẴN SÀNG BIỆT GIAM
                </>
              )}
            </span>

            {/* Toggle Tab Breach Watcher */}
            <button
              type="button"
              onClick={() => setStrictTabWatch(!strictTabWatch)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                strictTabWatch
                  ? 'bg-red-950/70 border-red-500 text-red-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{strictTabWatch ? '🔴 Bật phạt đổi tab' : '⚪ Tắt phạt đổi tab'}</span>
            </button>
          </div>

          {/* Current Target Task */}
          <div className="max-w-xl">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">
              {currentTask ? currentTask.title : 'Chọn hoặc tạo nhiệm vụ trước khi giam giữ!'}
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Quy tắc thép: Nếu bạn đổi tab, thu nhỏ cửa sổ hoặc nghịch điện thoại, hệ thống sẽ hú còi và phạt HP ngay lập tức!
            </p>
          </div>

          {/* Giant Digital Timer Display */}
          <div className="relative">
            <div className={`font-mono text-7xl md:text-9xl font-black tracking-tighter select-none ${
              isActive ? 'text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.6)]' : 'text-zinc-100'
            }`}>
              {formatTime(timeLeft)}
            </div>

            {isActive && (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-red-400 mt-2">
                <Radio className="w-3.5 h-3.5 animate-ping text-red-500" />
                <span>CẢM BIẾN TẬP TRUNG ĐANG HOẠT ĐỘNG</span>
              </div>
            )}
          </div>

          {/* Tab Breach Warning if happened */}
          {lastBreachWarning && (
            <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2 animate-bounce">
              <ShieldX className="w-5 h-5 text-red-400" />
              <span>{lastBreachWarning}</span>
            </div>
          )}

          {/* Duration Preset Selector (When idle) */}
          {!isActive && (
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTargetDuration(mins);
                    setTimeLeft(mins * 60);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    targetDuration === mins
                      ? 'bg-amber-500 text-black shadow-md scale-105'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {mins} phút {mins === 25 ? '🔥 (Chuẩn)' : ''}
                </button>
              ))}
            </div>
          )}

          {/* Timer Primary Action Controls */}
          <div className="flex items-center gap-3 pt-2">
            {!isActive ? (
              <button
                onClick={startQuarantine}
                disabled={!selectedTaskId}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-black font-black uppercase text-sm tracking-wider rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer disabled:opacity-40"
              >
                <Play className="w-5 h-5 fill-current" />
                Khoá Cửa Biệt Giam Ngay!
              </button>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleManualComplete}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  Xong Trước Hạn • Nộp Bằng Chứng
                </button>
                <button
                  onClick={abortQuarantine}
                  className="px-5 py-3.5 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 font-bold uppercase text-xs rounded-xl border border-zinc-700 flex items-center gap-2 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Đầu Hàng (Bị Phạt 10 HP)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Queue & Quarantine Management */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Danh Sách Mục Tiêu Không Được Bỏ Cuộc</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Thêm Nhiệm Vụ Mới
          </button>
        </div>

        {/* Add Task Form Collapsible */}
        {showAddForm && (
          <form onSubmit={handleAddNewTask} className="mb-6 p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Tên công việc cần tập trung:</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="VD: Viết xong 3 trang báo cáo, giải 5 bài LeetCode..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Hình thức chống gian lận:</label>
                <select
                  value={newTaskAntiCheat}
                  onChange={(e) => setNewTaskAntiCheat(e.target.value as AntiCheatType)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="typing_oath">Gõ Lời Thề Kỷ Luật (Typing Oath)</option>
                  <option value="ai_proof_summary">AI Kiểm Định Tóm Tắt (Gemini Review)</option>
                  <option value="speed_math">Toán Logic Thần Tốc (Speed Math)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs rounded-lg shadow"
                >
                  Lưu & Đưa Vào Biệt Giam
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Task Items List */}
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => !isActive && setSelectedTaskId(task.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800/90 border-amber-500/80 shadow-md'
                    : isDone
                    ? 'bg-zinc-950/40 border-zinc-800/50 opacity-60'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                        : isSelected
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isDone ? '✓' : isSelected ? '▶' : '•'}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      <span>{task.targetMinutes} phút</span>
                      <span>•</span>
                      <span className="text-amber-400 font-mono">
                        {task.antiCheat === 'ai_proof_summary'
                          ? 'AI Audit'
                          : task.antiCheat === 'speed_math'
                          ? 'Math Challenge'
                          : 'Lời thề'}
                      </span>
                      {task.aiScore && (
                        <span className="text-emerald-400 font-bold">• Điểm AI: {task.aiScore}/100</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isDone && !isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerifyingTask(task);
                      }}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-bold"
                    >
                      Kiểm định
                    </button>
                  )}
                  {!isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="p-1.5 text-zinc-600 hover:text-red-400 rounded transition-colors"
                      title="Xoá nhiệm vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

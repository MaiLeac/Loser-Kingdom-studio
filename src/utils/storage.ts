import { SAFE_PUNISHMENTS, migratePunishments } from './safePunishments';
import { UserStats, TaskItem, PunishmentItem, InfractionLog, LoserRank } from '../types';

const STATS_KEY = 'vuong_quoc_loser_stats_v1';
const TASKS_KEY = 'vuong_quoc_loser_tasks_v1';
const PUNISHMENTS_KEY = 'vuong_quoc_loser_punishments_v1';
const LOGS_KEY = 'vuong_quoc_loser_logs_v1';

export const INITIAL_STATS: UserStats = {
  hp: 75,
  xp: 120,
  level: 1,
  rank: 'Tân Binh Ngáo Đá',
  dopamineAddiction: 85,
  shamePoints: 12,
  completedTasks: 2,
  failedTasks: 5,
  quarantineBreaches: 2,
  penancesPaid: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Code xong tính năng auth không mở tab linh tinh',
    targetMinutes: 25,
    category: 'code',
    antiCheat: 'ai_proof_summary',
    status: 'pending',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't-2',
    title: 'Học 30 từ vựng chuyên ngành hoặc đọc 15 trang sách',
    targetMinutes: 30,
    category: 'study',
    antiCheat: 'typing_oath',
    status: 'pending',
    createdAt: Date.now() - 1800000,
  },
  {
    id: 't-3',
    title: 'Dọn dẹp bàn làm việc sạch bóng như khách sạn 5 sao',
    targetMinutes: 15,
    category: 'workout',
    antiCheat: 'speed_math',
    status: 'pending',
    createdAt: Date.now() - 600000,
  },
];

export const INITIAL_PUNISHMENTS: PunishmentItem[] = [];
export const COMMUNITY_TORTURE_VAULT = SAFE_PUNISHMENTS;

export function calculateRank(xp: number, hp: number, completedCount: number): LoserRank {
  if (completedCount >= 25 && hp > 80 && xp >= 1500) return 'Đấng Tỉnh Thức';
  if (completedCount >= 15 && hp > 65 && xp >= 900) return 'Chiến Binh Thép';
  if (completedCount >= 8 && xp >= 500) return 'Kẻ Tập Sự Kỷ Luật';
  if (completedCount >= 4 && xp >= 250) return 'Tù Nhân Sám Hối';
  if (xp >= 100) return 'Chúa Tể Trì Hoãn';
  if (xp >= 50) return 'Kẻ Đốt Thời Gian';
  if (hp < 30) return 'Con Nghiện Video Ngắn';
  return 'Tân Binh Ngáo Đá';
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: UserStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function loadTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: TaskItem[]) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

export function loadPunishments(): PunishmentItem[] {
  try {
    const raw = localStorage.getItem(PUNISHMENTS_KEY);
    if (!raw) return INITIAL_PUNISHMENTS;
    return migratePunishments(JSON.parse(raw));
  } catch {
    return INITIAL_PUNISHMENTS;
  }
}

export function savePunishments(punishments: PunishmentItem[]) {
  try {
    localStorage.setItem(PUNISHMENTS_KEY, JSON.stringify(punishments));
  } catch (err) {
    console.error('Failed to save punishments', err);
  }
}

export function loadLogs(): InfractionLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      return [
        {
          id: 'log-1',
          timestamp: Date.now() - 7200000,
          appAbused: 'TikTok',
          reason: 'Bảo xem 1 clip nhưng ngồi lướt 75 phút',
          roastReceived: 'Nằm coi mấy đứa nhép nhạc 15 giây mà tưởng mình đang thư giãn. Nghèo rớt mồng tơi kìa!',
          hpLost: 25,
          punishmentAssigned: 'Chống đẩy 25 cái'
        }
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLogs(logs: InfractionLog[]) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs', err);
  }
}

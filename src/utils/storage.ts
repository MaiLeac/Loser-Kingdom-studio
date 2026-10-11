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

export const INITIAL_PUNISHMENTS: PunishmentItem[] = [
  {
    id: 'p-1',
    title: 'Chống đẩy sám hối 25 cái',
    description: 'Rời ghế ngay lập tức, hít đất 25 cái sát sàn để máu dồn lên não tỉnh ngộ!',
    category: 'physical',
    severity: 'mild',
    completed: false,
    assignedAt: Date.now() - 8000000,
    source: 'system',
  },
  {
    id: 'p-2',
    title: 'Detox mắt: Nhìn xa 50 mét trong 5 phút',
    description: 'Đứng ra ban công/cửa sổ nhìn vào một điểm xa xăm không chạm điện thoại.',
    category: 'isolation',
    severity: 'mild',
    completed: true,
    assignedAt: Date.now() - 10000000,
    completedAt: Date.now() - 9000000,
    source: 'community',
  },
  {
    id: 'p-3',
    title: 'Tự soi gương đếm 10 lý do mình đang nghèo',
    description: 'Vào nhà vệ sinh nhìn thẳng vào mắt mình trong gương và nói to 10 sự thật tàn nhẫn.',
    category: 'shame',
    severity: 'severe',
    completed: false,
    assignedAt: Date.now() - 4000000,
    source: 'community',
  },
];

export const COMMUNITY_TORTURE_VAULT: Array<Omit<PunishmentItem, 'id' | 'assignedAt' | 'completed'>> = [
  {
    title: 'Squat 40 cái liên tục',
    description: 'Lưng thẳng, đùi vuông góc. Đếm to từng cái một để cả nhà cùng nghe thấy!',
    category: 'physical',
    severity: 'severe',
    source: 'community',
  },
  {
    title: 'Cách ly điện thoại trong tủ lạnh 20 phút',
    description: 'Đặt điện thoại vào ngăn mát (không cho vào ngăn đá) và quay lại bàn học ngay.',
    category: 'isolation',
    severity: 'severe',
    source: 'community',
  },
  {
    title: 'Rửa mặt bằng nước đá lạnh buốt',
    description: 'Cho 3 viên đá vào chậu nước vỗ mặt 10 lần cho não bộ bớt mụ mị vì dopamine.',
    category: 'shock',
    severity: 'mild',
    source: 'community',
  },
  {
    title: 'Viết thư tuyệt giao với TikTok/Reels',
    description: 'Lấy giấy bút thật viết 100 từ cam kết không đụng vào video ngắn trong 48h.',
    category: 'shame',
    severity: 'mild',
    source: 'community',
  },
  {
    title: 'Plank tử thần 90 giây',
    description: 'Không cong mông, không sập eo. Mỗi giây rung lắc là cái giá của sự lười biếng.',
    category: 'physical',
    severity: 'hell',
    source: 'community',
  },
  {
    title: 'Hát to một câu sám hối ngoài ban công',
    description: 'Bước ra cửa sổ hét to: "Tôi là kẻ lười biếng nhưng từ giờ tôi sẽ thay đổi!"',
    category: 'shame',
    severity: 'hell',
    source: 'community',
  },
];

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
    return JSON.parse(raw);
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

export type LoserRank =
  | 'Tân Binh Ngáo Đá'
  | 'Con Nghiện Video Ngắn'
  | 'Kẻ Đốt Thời Gian'
  | 'Chúa Tể Trì Hoãn'
  | 'Tù Nhân Sám Hối'
  | 'Kẻ Tập Sự Kỷ Luật'
  | 'Chiến Binh Thép'
  | 'Đấng Tỉnh Thức';

export interface UserStats {
  hp: number; // 0 - 100
  xp: number;
  level: number;
  rank: LoserRank;
  dopamineAddiction: number; // 0 - 100
  shamePoints: number;
  completedTasks: number;
  failedTasks: number;
  quarantineBreaches: number;
  penancesPaid: number;
  streakDays: number;
  lastActiveDate: string;
}

export type AntiCheatType = 'typing_oath' | 'speed_math' | 'ai_proof_summary';

export interface TaskItem {
  id: string;
  title: string;
  targetMinutes: number;
  category: 'work' | 'study' | 'code' | 'workout' | 'reading';
  antiCheat: AntiCheatType;
  status: 'pending' | 'in_quarantine' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  proofSubmitted?: string;
  aiScore?: number;
  aiFeedback?: string;
}

export interface PunishmentItem {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'shock' | 'isolation' | 'shame';
  severity: 'mild' | 'severe' | 'hell';
  completed: boolean;
  assignedAt: number;
  completedAt?: number;
  source: 'ai_generated' | 'system' | 'community';
}

export interface InfractionLog {
  id: string;
  timestamp: number;
  appAbused: string;
  reason: string;
  roastReceived: string;
  hpLost: number;
  punishmentAssigned?: string;
  outcome?: 'accountability' | 'rest' | 'clarify';
  reasonCategory?: string;
}

export type DisruptionType =
  | 'none'
  | 'blue_screen'
  | 'siren_alarm'
  | 'ugly_mirror'
  | 'glitch_inverted'
  | 'shame_lockout';

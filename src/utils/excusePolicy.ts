/** Self-reported discipline policy. This is not a lie detector or medical assessment. */
export const REASON_OPTIONS = [
  { value: 'auto', label: 'Để hệ thống phân loại / chưa rõ' },
  { value: 'health', label: 'Tai nạn, bệnh hoặc đau' },
  { value: 'emergency', label: 'Việc khẩn cấp / trách nhiệm gia đình' },
  { value: 'recovery', label: 'Mệt, thiếu ngủ hoặc cần hồi phục' },
  { value: 'distraction', label: 'Tự nhận đang trì hoãn / lướt giải trí' },
] as const;
export type ReasonType = typeof REASON_OPTIONS[number]['value'];
export type ReviewDecision = 'rest' | 'clarify' | 'accountability';
export interface ExcuseReview {
  decision: ReviewDecision;
  category: ReasonType;
  roast: string; // Existing API field retained for compatibility; can be compassionate.
  hpPenalty: 0 | 10;
  isFallback: boolean;
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

const health = /\b(tai nan|nga xe|te xe|va cham|chan thuong|gay (chan|tay|xuong)|bong gan|benh|om|sot|dau (bung|dau|nguc|chan|tay)|kho tho|nhap vien|cap cuu|phau thuat|tram cam|hoang loan|panic attack|accident|injur\w*|fractur\w*|hospital|illness|sick)\b/;
const emergency = /\b(khan cap|cham (con|me|bo|nguoi than)|cham soc|nguoi than.*(benh|mat)|tang le|dam tang|emergency|bereavement|caregiving)\b/;
const recovery = /\b(met|kiet suc|thieu ngu|mat ngu|can nghi|hoi phuc|tinh duong|burnout|exhaust\w*|sleep deprived|recovery|fatigue|tired)\b/;
const distraction = /\b(luot|san sale|cho cam hung|doi cam hung|chua den han|con.*ngay.*(han|deadline)|doomscroll\w*|procrastinat\w*)\b/;

export function classifyReason(excuse: string, selected: unknown = 'auto'): ReasonType {
  const choice = REASON_OPTIONS.find(option => option.value === selected)?.value || 'auto';
  const text = normalizeText(excuse);
  // Safety takes priority over an accidentally selected entertainment category.
  if (health.test(text)) return 'health';
  if (emergency.test(text)) return 'emergency';
  if (recovery.test(text)) return 'recovery';
  if (choice !== 'auto') return choice;
  return distraction.test(text) ? 'distraction' : 'auto';
}

export function reviewExcuse(excuse: string, reasonType: unknown = 'auto'): ExcuseReview {
  const category = classifyReason(excuse, reasonType);
  if (category === 'health' || category === 'emergency' || category === 'recovery') {
    const message = category === 'health'
      ? 'Tai nạn hoặc vấn đề sức khỏe không phải là lười biếng. Ưu tiên an toàn và hồi phục; nhiệm vụ có thể để lại. Khi sẵn sàng, mày quay lại với một bước vừa sức nhé.'
      : category === 'emergency'
      ? 'Việc khẩn cấp và chăm sóc người thân được ưu tiên. Hôm nay không phạt; nhiệm vụ vẫn chờ, khi ổn rồi hãy sắp xếp lại.'
      : 'Cần nghỉ và hồi phục không phải là tội. Không ép làm tiếp, không phạt; khi đủ sức, chọn một bước nhỏ hoặc giảm thời lượng.';
    return { decision: 'rest', category, roast: message, hpPenalty: 0, isFallback: true };
  }
  if (category === 'auto') {
    return { decision: 'clarify', category, roast: 'Tao chưa đủ thông tin để kết luận đây là trì hoãn. Chọn loại lý do phù hợp hoặc nói rõ thêm; chưa có hình phạt nào được áp dụng.', hpPenalty: 0, isFallback: true };
  }
  return { decision: 'accountability', category: 'distraction', roast: 'Mày vừa tự nhận đang trì hoãn. Tab giải trí không làm hộ công việc đâu: đóng một tab không cần thiết rồi chọn bước nhỏ tiếp theo.', hpPenalty: 10, isFallback: true };
}

export function isExcuseReview(value: unknown): value is ExcuseReview {
  if (!value || typeof value !== 'object') return false;
  const v = value as ExcuseReview;
  return ['rest', 'clarify', 'accountability'].includes(v.decision)
    && REASON_OPTIONS.some(o => o.value === v.category)
    && typeof v.roast === 'string' && v.roast.trim().length > 0 && v.roast.length <= 1200
    && typeof v.isFallback === 'boolean'
    && (v.decision === 'accountability' ? v.category === 'distraction' : v.decision === 'clarify' ? v.category === 'auto' : ['health', 'emergency', 'recovery'].includes(v.category))
    && v.hpPenalty === (v.decision === 'accountability' ? 10 : 0);
}

// Generated copy is never allowed to add a punishment or overturn the decision.
export function safeAccountabilityCopy(text: unknown): text is string {
  if (typeof text !== 'string' || text.trim().length < 10 || text.length > 600) return false;
  return !/\b(tu tat|tat.*(mat|ma)|gay (chan|tay)|chong day|hit dat|plank|squat|nuoc (muoi|da)|nhin an|nhin ngu|nhin tho|quy xuong|ban cong|vo dung|phe vat|nguoi than|benh|tai nan|doi chet|tu tu)\b/.test(normalizeText(text));
}

export function applyReviewPenalty<T extends { hp: number; shamePoints: number; dopamineAddiction: number }>(stats: T, review: ExcuseReview): T {
  if (review.decision !== 'accountability') return stats;
  return { ...stats, hp: Math.max(0, stats.hp - review.hpPenalty), shamePoints: stats.shamePoints + 8, dopamineAddiction: Math.min(100, stats.dopamineAddiction + 12) };
}

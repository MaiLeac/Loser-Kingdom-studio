import type { PunishmentItem } from '../types';
export const SAFE_PUNISHMENTS: Array<Omit<PunishmentItem, 'id' | 'assignedAt' | 'completed'>> = [
  {title: 'Chọn một bước nhỏ', description: 'Viết một việc cụ thể bạn muốn làm tiếp. Có thể bỏ qua nếu đang cần nghỉ.', category: 'isolation', severity: 'mild', source: 'system'},
  {title: 'Dọn một tab', description: 'Đóng một tab giải trí không cần thiết. Giữ các kênh liên lạc cần thiết.', category: 'isolation', severity: 'mild', source: 'system'},
  {title: 'Lên kế hoạch vừa sức', description: 'Ghi thời điểm thuận tiện để quay lại và giảm thời lượng nếu cần. Không bắt buộc làm ngay.', category: 'isolation', severity: 'mild', source: 'system'},
];
export function isReviewedPunishment(value: unknown): value is typeof SAFE_PUNISHMENTS[number] {
  if (!value || typeof value !== 'object') return false;
  const item = value as PunishmentItem;
  return SAFE_PUNISHMENTS.some(s => s.title === item.title && s.description === item.description && s.category === item.category);
}
export function migratePunishments(items: PunishmentItem[]): PunishmentItem[] {
  // Retire old/custom unreviewed instructions without granting completion rewards.
  return items.filter(isReviewedPunishment);
}

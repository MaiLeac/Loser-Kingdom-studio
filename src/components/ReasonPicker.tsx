import React from 'react';
import { REASON_OPTIONS, ReasonType } from '../utils/excusePolicy';

export function ReasonPicker({ value, onChange }: { value: ReasonType; onChange: (value: ReasonType) => void }) {
  return <label className="block space-y-2 text-xs text-zinc-300">
    <span className="font-bold">Loại lý do</span>
    <select aria-label="Loại lý do" value={value} onChange={event => onChange(event.target.value as ReasonType)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white">
      {REASON_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <span className="block text-zinc-400 leading-relaxed">Sức khỏe, hồi phục và việc khẩn cấp được nghỉ không phạt. Không cần giấy tờ hay ảnh; nghỉ không cộng điểm hoặc hoàn thành nhiệm vụ.</span>
  </label>;
}

import React, { useEffect, useState, useRef } from 'react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import { ExcuseReview, isExcuseReview, ReasonType, reviewExcuse } from '../utils/excusePolicy';
import { ReasonPicker } from './ReasonPicker';
interface Props {
  stats: UserStats;
  recoveryMode: boolean;
  onReviewResult: (review: ExcuseReview, reason: string, app: string) => void;
  onRequestRest: () => void;
}
export const SavageRoastChamber: React.FC<Props> = ({ onReviewResult, onRequestRest, recoveryMode }) => {
  const recoveryRef = useRef(recoveryMode);
  recoveryRef.current = recoveryMode;
  const [app, setApp] = useState('TikTok');
  const [excuse, setExcuse] = useState('');
  const [reasonType, setReasonType] = useState<ReasonType>('auto');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ExcuseReview | null>(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  useEffect(() => {
    const listener = (event: Event) => setVoiceStatus((event as CustomEvent<string>).detail);
    window.addEventListener('voice-status', listener);
    return () => window.removeEventListener('voice-status', listener);
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || recoveryMode) return;
    setLoading(true);
    const local = reviewExcuse(excuse, reasonType);
    try {
      // Protected requests work offline and never send health details to Gemini.
      let result = local;
      if (local.decision === 'accountability') {
        const response = await fetch('/api/roast', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetApp: app, excuse, reasonType }),
        });
        const data: unknown = await response.json();
        if (!response.ok || !isExcuseReview(data)) throw new Error('Invalid response');
        result = data;
      }
      if (recoveryRef.current) return;
      onReviewResult(result, excuse, app);
      setReview(result);
      sound.speakRoast(result.roast);
    } catch {
      setReview({decision: 'clarify', category: 'auto', hpPenalty: 0, isFallback: true,
        roast: 'Chưa kết nối được hệ thống. Không phạt vì lỗi mạng. Thử lại hoặc bấm xin nghỉ nếu cần.'});
    } finally { setLoading(false); }
  };
  return <div className="space-y-6">
    <section className="bg-zinc-900 border border-red-800 rounded-3xl p-6">
      <h2 className="text-2xl font-black">Ma Vương · châm biếm có giới hạn</h2>
      <p className="text-sm text-zinc-400 mt-2">Nhắc thói quen trì hoãn; tai nạn, sức khỏe và việc khẩn cấp được ưu tiên. Lý do chưa rõ thì hỏi thêm, không kết tội.</p>
    </section>
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <label className="block text-sm">Ứng dụng / hoạt động
          <input value={app} onChange={e => setApp(e.target.value)} maxLength={120} className="block w-full mt-2 p-3 rounded-xl bg-zinc-950" />
        </label>
        <label className="block text-sm">Chuyện gì khiến bạn chưa làm tiếp?
          <textarea value={excuse} onChange={e => setExcuse(e.target.value)} maxLength={2000} rows={4}
            placeholder="Ví dụ: Tao vừa ngã xe, cần nghỉ; hoặc tao đang lướt TikTok..."
            className="block w-full mt-2 p-3 rounded-xl bg-zinc-950" />
        </label>
        <ReasonPicker value={reasonType} onChange={setReasonType} />
        <button disabled={loading || recoveryMode} className="w-full bg-red-600 disabled:opacity-50 font-bold p-3 rounded-xl">{recoveryMode ? 'Đang hồi phục · quay lại khi sẵn sàng' : loading ? 'Đang xem lý do...' : 'Gửi lý do'}</button>
        <button type="button" onClick={onRequestRest} className="w-full bg-zinc-800 p-3 rounded-xl">Xin nghỉ ngay · không phạt</button>
      </form>
      <section className="bg-zinc-950 border border-zinc-700 rounded-2xl p-6 space-y-4" aria-live="polite">
        <h3 className="font-bold">{review ? review.decision === 'rest' ? 'Được nghỉ · 0 HP phạt' : review.decision === 'clarify' ? 'Cần làm rõ · chưa phạt' : 'Nhắc kỷ luật · −10 HP' : 'Ma Vương đang nghe'}</h3>
        <p className="text-lg leading-relaxed">{review?.roast || 'Nói rõ lý do hoặc chọn nhóm phù hợp. Không cần gửi giấy tờ hay ảnh thương tích.'}</p>
        {review && <button onClick={() => sound.speakRoast(review.roast)} className="bg-zinc-800 p-3 rounded-xl">Nghe lại giọng Việt</button>}
        {voiceStatus && <p className="text-sm text-amber-300">{voiceStatus}</p>}
        <p className="text-xs text-zinc-400">Xin nghỉ không cộng XP, hồi HP hoặc hoàn thành nhiệm vụ. Nội dung châm biếm không được biến thành chỉ dẫn hành xác.</p>
      </section>
    </div>
  </div>;
};

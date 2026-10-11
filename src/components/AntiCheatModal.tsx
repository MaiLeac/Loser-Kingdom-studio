import React, { useState } from 'react';
import { TaskItem, AntiCheatType } from '../types';
import { sound } from '../utils/audio';
import { ShieldCheck, ShieldAlert, Cpu, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

interface Props {
  task: TaskItem;
  onSuccess: (proofContent: string, aiScore?: number, aiFeedback?: string) => void;
  onFail: (reason: string) => void;
  onCancel: () => void;
}

export const AntiCheatModal: React.FC<Props> = ({ task, onSuccess, onFail, onCancel }) => {
  const [selectedType, setSelectedType] = useState<AntiCheatType>(task.antiCheat || 'typing_oath');
  
  // 1. Typing Oath State
  const OATH_TEXT = 'Tôi thề danh dự đã hoàn thành nhiệm vụ này nghiêm túc, không hề lướt mạng xã hội hay dối lừa bản thân.';
  const [typedOath, setTypedOath] = useState('');

  // 2. AI Proof Summary State
  const [proofText, setProofText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 3. Speed Math State
  const [mathAnswers, setMathAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [mathQuestions] = useState([
    { text: '17 + 28', ans: 45 },
    { text: '12 × 7', ans: 84 },
    { text: '95 - 38', ans: 57 },
  ]);

  // Handle Oath Submission
  const handleOathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedOath.trim() === OATH_TEXT.trim()) {
      sound.playSuccess();
      onSuccess(typedOath, 95, 'Đã xác nhận lời thề danh dự!');
    } else {
      sound.playBuzzer();
      onFail('Gõ sai lời thề danh dự! Đừng hòng gian lận qua ải!');
    }
  };

  // Handle AI Proof Submission
  const handleAiProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (proofText.trim().length < 15) {
      sound.playBuzzer();
      setAiError('Nội dung quá ngắn! Hãy mô tả chi tiết bài học, công việc hoặc đoạn code vừa viết.');
      return;
    }

    setIsEvaluating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          proofType: 'summary',
          proofContent: proofText,
        }),
      });

      const data = await res.json();
      setIsEvaluating(false);

      if (data.approved) {
        sound.playSuccess();
        onSuccess(proofText, data.score, data.feedback);
      } else {
        sound.playBuzzer();
        onFail(data.penaltyReason || data.feedback || 'AI từ chối bằng chứng!');
      }
    } catch (err: any) {
      setIsEvaluating(false);
      // Fallback local acceptance if fetch failed
      sound.playSuccess();
      onSuccess(proofText, 80, 'Thẩm định ngoại tuyến được chấp thuận.');
    }
  };

  // Handle Math Submit
  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct1 = parseInt(mathAnswers.q1.trim(), 10) === mathQuestions[0].ans;
    const correct2 = parseInt(mathAnswers.q2.trim(), 10) === mathQuestions[1].ans;
    const correct3 = parseInt(mathAnswers.q3.trim(), 10) === mathQuestions[2].ans;

    if (correct1 && correct2 && correct3) {
      sound.playSuccess();
      onSuccess('Giải toán logic thành công', 100, 'Bộ não đã hoàn toàn tỉnh táo và tập trung!');
    } else {
      sound.playBuzzer();
      onFail('Tính toán sai! Dopamine vẫn đang làm mờ mắt!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="max-w-xl w-full bg-zinc-950 border-2 border-emerald-500/60 rounded-3xl p-6 md:p-8 text-white space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-emerald-300">
                Thẩm Định Chống Gian Lận
              </h3>
              <p className="text-xs text-zinc-400">
                Nhiệm vụ: <span className="text-white font-semibold">"{task.title}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-zinc-300 text-sm px-2 py-1 rounded"
          >
            Đóng
          </button>
        </div>

        {/* Challenge Selection */}
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedType('typing_oath')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              selectedType === 'typing_oath'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ✍️ Lời Thề Kỷ Luật
          </button>
          <button
            onClick={() => setSelectedType('ai_proof_summary')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 ${
              selectedType === 'ai_proof_summary'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI Kiểm Định
          </button>
          <button
            onClick={() => setSelectedType('speed_math')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              selectedType === 'speed_math'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ Tính Thần Tốc
          </button>
        </div>

        {/* 1. TYPING OATH */}
        {selectedType === 'typing_oath' && (
          <form onSubmit={handleOathSubmit} className="space-y-4">
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Hãy gõ chính xác 100% dòng chữ sau:
              </span>
              <p className="font-mono text-sm text-yellow-300 bg-black/60 p-3 rounded-lg select-none border border-yellow-500/30">
                {OATH_TEXT}
              </p>
            </div>

            <textarea
              rows={3}
              value={typedOath}
              onChange={(e) => setTypedOath(e.target.value)}
              placeholder="Gõ lại chính xác lời thề ở trên..."
              className="w-full bg-black border border-emerald-500/50 rounded-xl p-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">
                Độ dài: {typedOath.length}/{OATH_TEXT.length}
              </span>
              <button
                type="submit"
                disabled={typedOath.trim().length === 0}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase text-xs rounded-xl tracking-wider transition-transform active:scale-95"
              >
                Xác Nhận Đã Làm Xong
              </button>
            </div>
          </form>
        )}

        {/* 2. AI PROOF AUDIT */}
        {selectedType === 'ai_proof_summary' && (
          <form onSubmit={handleAiProofSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Nộp bản tóm tắt hoặc đoạn mã / ghi chú thành quả:
              </label>
              <textarea
                rows={5}
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="VD: Đã hoàn thành đọc chương 4 về Microservices, note được 5 ý chính: ..., hoặc dán code chức năng vừa viết..."
                className="w-full bg-black border border-emerald-500/50 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
              />
            </div>

            {aiError && (
              <p className="text-red-400 text-xs font-semibold bg-red-950/60 p-2.5 rounded-lg border border-red-800">
                {aiError}
              </p>
            )}

            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 italic">
                AI Gemini sẽ quét nội dung xem có spam chống đối không.
              </span>
              <button
                type="submit"
                disabled={isEvaluating}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black font-black uppercase text-xs rounded-xl tracking-wider transition-all flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    AI Đang Quét...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" /> Gửi AI Phê Duyệt
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 3. SPEED MATH */}
        {selectedType === 'speed_math' && (
          <form onSubmit={handleMathSubmit} className="space-y-4">
            <p className="text-xs text-zinc-300">
              Giải nhanh 3 câu hỏi này trong đầu để chứng minh neuron thần kinh của bạn không bị tê liệt bởi video ngắn:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-xs text-yellow-300 block mb-1">{mathQuestions[0].text} = ?</span>
                <input
                  type="number"
                  value={mathAnswers.q1}
                  onChange={(e) => setMathAnswers({ ...mathAnswers, q1: e.target.value })}
                  placeholder="Đáp án"
                  className="w-full bg-black border border-zinc-700 rounded p-1.5 text-center text-sm font-bold"
                />
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-xs text-yellow-300 block mb-1">{mathQuestions[1].text} = ?</span>
                <input
                  type="number"
                  value={mathAnswers.q2}
                  onChange={(e) => setMathAnswers({ ...mathAnswers, q2: e.target.value })}
                  placeholder="Đáp án"
                  className="w-full bg-black border border-zinc-700 rounded p-1.5 text-center text-sm font-bold"
                />
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <span className="text-xs text-yellow-300 block mb-1">{mathQuestions[2].text} = ?</span>
                <input
                  type="number"
                  value={mathAnswers.q3}
                  onChange={(e) => setMathAnswers({ ...mathAnswers, q3: e.target.value })}
                  placeholder="Đáp án"
                  className="w-full bg-black border border-zinc-700 rounded p-1.5 text-center text-sm font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs rounded-xl tracking-wider transition-all"
            >
              Nộp Bài & Hoàn Thành Thử Thách
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

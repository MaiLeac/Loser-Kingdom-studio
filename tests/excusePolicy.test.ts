import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewExcuse, applyReviewPenalty, isExcuseReview } from '../src/utils/excusePolicy';
import { generateReview } from '../roastService';
import { SAFE_PUNISHMENTS, isReviewedPunishment, migratePunishments } from '../src/utils/safePunishments';
const stats = {hp: 75, xp: 120, shamePoints: 12, dopamineAddiction: 85, completedTasks: 2, failedTasks: 5, streakDays: 1};
for (const reason of ['Tao ngã xe gãy chân', 'Toi nga xe', 'Tao bị bệnh', 'Mẹ tao nhập viện', 'Tao đang chăm con', 'Việc khẩn cấp', 'Hôm nay thiếu ngủ, mệt quá']) {
  test(`protected: ${reason}`, async () => {
    let calls = 0;
    const result = await generateReview({excuse: reason, reasonType: 'distraction'}, async () => {calls++; return '{}';});
    assert.equal(result.decision, 'rest'); assert.equal(result.hpPenalty, 0); assert.equal(calls, 0);
    assert.strictEqual(applyReviewPenalty(stats, result), stats);
  });
}
test('unknown details are clarified without an accusation or model call', async () => {
  const result = await generateReview({excuse: 'Có chuyện khó nói'}, async () => {throw new Error('must not call');});
  assert.equal(result.decision, 'clarify'); assert.equal(result.hpPenalty, 0);
});
test('repeated rest cannot earn HP, XP, completion or a streak reset', () => {
  let current = stats;
  for (let i=0;i<100;i++) current = applyReviewPenalty(current, reviewExcuse('Cần nghỉ', 'recovery'));
  assert.deepEqual(current, stats);
});
test('a self-reported distraction has one bounded virtual penalty', () => {
  const result = reviewExcuse('Tao đang lướt TikTok');
  assert.equal(result.decision, 'accountability');
  const updated = applyReviewPenalty(stats, result);
  assert.equal(updated.hp, 65); assert.equal(updated.xp, 120); assert.equal(updated.completedTasks, 2);
});
test('the model cannot override the decision or penalty', async () => {
  const result = await generateReview({excuse: 'Đợi cảm hứng'}, async () => JSON.stringify({roast: 'Tab giải trí không làm hộ công việc. Chọn một bước nhỏ nhé.', decision: 'rest', hpPenalty: 999}));
  assert.equal(result.decision, 'accountability'); assert.equal(result.hpPenalty, 10);
});
for (const output of ['{', '{}', JSON.stringify({roast:'Gãy chân chứ có gãy tay đâu, làm tiếp đi!'}), JSON.stringify({roast:'Làm ngay 30 cái chống đẩy để chuộc lỗi.'})]) {
  test(`invalid or dangerous copy uses safe fallback: ${output}`, async () => {
    const result = await generateReview({excuse:'Lướt TikTok'}, async () => output);
    assert.equal(result.isFallback, true); assert.equal(result.hpPenalty, 10);
    assert.equal(result.roast, reviewExcuse('Lướt TikTok').roast);
  });
}
test('AI outage does not create a physical punishment', async () => {
  const result = await generateReview({excuse:'Lướt TikTok'}, async () => {throw new Error('offline');});
  assert.deepEqual(result, reviewExcuse('Lướt TikTok'));
});
test('API result validation rejects missing fields and penalty mismatch', () => {
  assert.equal(isExcuseReview({roast:'test'}), false);
  assert.equal(isExcuseReview({...reviewExcuse('Ngã xe'), hpPenalty:10}), false);
});
test('only exact reviewed challenges survive API/imported storage', () => {
  assert.ok(SAFE_PUNISHMENTS.every(isReviewedPunishment));
  const unsafe = {title:'Plank tử thần', description:'90 giây',category:'physical'};
  assert.equal(isReviewedPunishment(unsafe), false);
  assert.deepEqual(migratePunishments([unsafe as any]), []);
  assert.equal(isReviewedPunishment({...SAFE_PUNISHMENTS[0], description:'Chống đẩy'}), false);
});

test('mentioning a platform for work does not prove procrastination', () => {
  assert.equal(reviewExcuse('Tao đang làm nội dung TikTok cho khách hàng').decision, 'clarify');
});

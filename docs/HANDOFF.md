# Bàn giao bản Studio
Cập nhật 12/10/2026; trạng thái ghi nhận tại thời điểm viết, kiểm tra lại Git/PR trước khi làm.

## Git và bản chạy
- Repo: https://github.com/MaiLeac/Loser-Kingdom-studio
- Nhánh fix/compassionate-excuse-review; PR #1: https://github.com/MaiLeac/Loser-Kingdom-studio/pull/1.
- PR chưa merge ở lần xác nhận gần nhất. Không suy ra yêu cầu merge PR Python trước đó áp dụng PR này.
- Preview local cổng 3000 đã dừng khi kết thúc kiểm tra. App người dùng cổng 8888 là repo Python, không dùng policy Studio này.

## Chạy và test
Node 22+, npm ci, npm run dev; http://localhost:3000.
npm test: 19 test policy/service đạt ở lần kiểm tra 11/10; npm run lint (TypeScript) và npm run build đã đạt.
Không có Gemini key vẫn chạy policy/copy fallback. Secret trong server .env, không ở frontend.
Bộ test tổng workspace 52 test khoảng 25 giây; không kiểm chứng mọi luồng UI/AI live.

## Tệp quan trọng
server.ts: Express/API/Gemini.
roastService.ts: review cấu trúc, AI chỉ viết copy, fallback.
src/utils/excusePolicy.ts: rest/clarify/accountability và HP cố định.
src/utils/safePunishments.ts: catalog duyệt.
src/utils/audio.ts: chọn giọng đúng locale và mute.
src/App.tsx: recovery lưu localStorage, pause, guard callback/stat.
src/components/ReasonPicker.tsx, PanicModal.tsx, SavageRoastChamber.tsx: lựa chọn lý do/nghỉ.
src/components/HeaderHUD.tsx: header mobile không sticky.

## Đã có trên nhánh
Sức khỏe/tai nạn/khẩn cấp/chăm sóc/hồi phục ưu tiên nghỉ, kể cả chọn nhầm distraction; không gọi Gemini cho protected/unclear.
Mơ hồ hỏi lại 0 HP; tự nhận trì hoãn 10 HP ảo. AI không quyết định phạt.
Nghỉ giữ task pending, dừng timer/shock, không thưởng XP/HP hoặc reset streak, không giữ mô tả bệnh trong journal. Nhiều lần nghỉ chỉ gợi ý giảm tải.
Catalog an toàn và retire challenge cũ; overlay đang dùng là thông báo tĩnh có thể đóng. Có file disruption cũ còn trong repo nhưng không render trong flow đã sửa.
Voice Việt có lựa chọn chính xác; thiếu voice hiển thị chữ. Header mobile gọn, không sticky.

## Giới hạn / chưa quyết định
Keyword/category policy không hiểu hoàn hảo và không phát hiện nói dối. Instant rest/category picker là đường dự phòng.
localStorage tự sửa được: chưa có server tài khoản/chống gian lận bảng xếp hạng.
Google Calendar chưa tích hợp repo này. Chưa hợp nhất repo.
Model mặc định hiện gemini-3.8-flash trong mã gốc; roast có override GEMINI_MODEL. Chưa live-test model/key; không khẳng định model tồn tại/chạy được.
API verify-proof vẫn có prompt gắt cũ; chưa đại tu toàn bộ đánh giá bằng chứng.
Chưa onboarding mới, hệ nhân vật, provider voice, PWA/hosting hoàn chỉnh hay đo hiệu quả người dùng thật.

## Trước khi tiếp tục
Đọc PROJECT; kiểm tra scope và trạng thái PR. Không port feature giữa repo hay merge khi chưa chốt kế hoạch. Test protected/unclear/accountability, callback muộn trong lúc nghỉ, mute khi chờ voice và reload trước release.

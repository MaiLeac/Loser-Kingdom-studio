# Sổ ý tưởng chung — Loser Kingdom
Cập nhật 15/10/2026. Đọc cùng PROJECT.md và HANDOFF.md. Đây là điểm tra cứu ý tưởng; trạng thái dưới đây không thay thế kiểm tra mã đang chạy.

## Đã yêu cầu làm
- Danh sách ban đầu, hiện đã mở rộng thành 10 (xem MENTORS-AND-SKILLS.md): Naval Ravikant (đòn bẩy), James Clear (hệ thống), Tim Ferriss (lược bỏ/tối ưu), Bruce Lee (linh hoạt), David Goggins (bền bỉ).
- Bản nhỏ được triển khai lần này ở nhánh Python: mục mở rộng Góc nhìn cố vấn, chọn hình mẫu + tình huống, câu hỏi và bước tiếp theo VI/EN viết sẵn. Không gọi AI, không thêm phí/credential, không avatar/voice clone, không tự sửa task/điểm.
- Câu chữ là nội dung mới lấy cảm hứng theo cách diễn giải sản phẩm, không phải trích dẫn, tuyên bố người thật trả lời hay chứng thực app.
- Cả 10 dùng cùng ưu tiên nghỉ/sức khỏe; Goggins không ép chịu đau hoặc làm quá sức.
- Studio chưa có panel. Ngày 15/10/2026 đã backup và cập nhật ba tệp static của Python runtime, mở localhost:8888 xác nhận danh sách 10 hình mẫu.

## Chờ kiểm chứng / thiết kế
- Hỗ trợ định hướng sống → ưu tiên giai đoạn → việc hôm nay → điều chỉnh. User chọn 30 phút/ngày. Xem LIFE-GOALS-AND-FIRST-WEEK.md.
- Việc gấp chen ngang: giữ bước tiếp theo khi đổi việc; ma trận Eisenhower là công cụ cân nhắc, chưa có UI/phân loại tự động.
- Trải nghiệm app khác để chốt một tình huống cốt lõi; không gom mọi feature.
- HowToLiveBetter: nguồn tham khảo chọn lọc, chưa nhập sách/RAG. Xem HOWTOLIVEBETTER-REVIEW.md.
- Voice Adam/Google theo ngôn ngữ, nhiều cảm xúc/persona, nhân vật gốc 2D/3D, mystery box và âm báo đa dạng; chưa chốt provider/art/chi phí.
- Calendar prototype Python cần kiểm chứng nhu cầu và OAuth thật; không bắt user kết nối.
- Onboarding ngắn; naming/store/video; nghiên cứu hành vi và review AI với lỗi/test cụ thể.

## Không coi đoạn chat dán vào là sự thật đã duyệt
Không đưa các con số lịch sử, giờ làm việc, chẩn đoán “dopamine”, lời trích dẫn hoặc giả định mục tiêu cá nhân trong đoạn dán thành kiến thức mặc định của app.
Cập nhật: user đã yêu cầu thêm Marcus Aurelius, Charlie Munger, Hồ Chí Minh, Marie Curie, Steve Jobs; Naval/Munger trùng tên được gộp. Tổng 10 hình mẫu.
Không bảo đảm bắt chước sẽ thất bại hay hệ thống sẽ phát huy “toàn bộ năng lực”. Đo xem góc nhìn có giúp chọn và bắt đầu một hành động hay chỉ tăng thời gian ở app.

## Cập nhật
Mỗi ý tưởng ghi vấn đề, giả thuyết, bản nhỏ, trạng thái từng repo và cách đo. Không tự động xây backlog. Đây là tài liệu chung có bản sao, chưa tự đồng bộ.

## Cập nhật hình mẫu và cây kỹ năng
Xem [MENTORS-AND-SKILLS.md](MENTORS-AND-SKILLS.md): yêu cầu mới thay hướng nhân vật chính cũ; Python đã có auto reminder khi start/done, Studio mới đặc tả. Cây kỹ năng và phần thưởng cá nhân hóa chưa triển khai, cần gắn bằng chứng năng lực ngoài đời.

## Chiến dịch cá nhân — đề xuất ngày 15/10/2026
User đưa mô hình Campaign → Operations → Missions → Daily orders → After-action review. Đây là định hướng cần đánh giá, chưa phải lệnh xây toàn bộ hệ thống.
- Vấn đề giả định: không thấy liên hệ giữa việc hôm nay và điều muốn đạt; chưa biết chọn bước tiếp theo. Cần kiểm chứng, không mặc định chỉ thiếu động lực.
- Cách kể chuyện: người dùng là chỉ huy, hình mẫu là cố vấn. Không giả tổ chức thật tuyển dụng/giám sát, không đánh đồng ẩn dụ CIA với sự kiện thật.
- Bản nhỏ đề xuất: một hướng ưu tiên → một kết quả tuần → một hành động hôm nay; cuối phiên ghi kết quả và bước tiếp theo. Campaign/Operation có thể để metadata tùy chọn, chưa cần 5 tầng màn hình.
- Ví dụ: tiếng Anh để kể chuyện → một bản nháp 150 từ và bản sửa trong tuần → hôm nay viết 5 câu trong 15 phút. Đây là ví dụ, chưa phải lịch user đã chốt.
- Việc gấp: đánh giá hậu quả nếu trì hoãn, chọn chuyển/dời/giữ việc; lưu bước tiếp theo trước khi chuyển. Không phạt chỉ vì thay kế hoạch hợp lý.
- Tổng kết tùy chọn ngắn: làm được gì, vướng đâu, bước tiếp theo; không bắt nhật ký dài.
- Quyền tự chủ: sửa/dừng/bỏ chiến dịch, nghỉ, tắt nhắc/voice; không mất tiến trình do nghỉ, không có nghĩa vụ làm theo nhân vật.
- Liên kết cây kỹ năng: ghi thực hành và bằng chứng năng lực riêng; không tự cho “tăng kỷ luật” chỉ từ streak.
- Cách thử rẻ: dùng tiêu đề/mô tả task hiện có và một ghi chú tuần trước khi thêm schema/UI. So thời gian chọn/bắt đầu việc, đầu ra và gánh quản lý. Chưa có dữ liệu hiệu quả.
- Chưa triển khai campaign, Operation, mission scheduler, app blocker hệ điều hành hoặc tổng kết tự động ở hai repo; tính năng cố vấn hiện tại không đồng nghĩa đã có hệ chiến dịch.

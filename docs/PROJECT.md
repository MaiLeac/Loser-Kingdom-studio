# Hồ sơ chung Loser Kingdom
Cập nhật 12/10/2026. Tài liệu tổng hợp yêu cầu và quyết định từ cuộc trao đổi với chủ dự án; không phải toàn bộ transcript. Không suy ra rằng mọi ý tưởng dưới đây đều được phép triển khai ngay.

## Đọc trước khi sửa
1. AGENTS.md ở gốc repo.
2. docs/PROJECT.md (tài liệu này): mục tiêu và trạng thái yêu cầu.
3. docs/HANDOFF.md: trạng thái riêng của repo, cách chạy và kiểm tra.
4. docs/DECISIONS.md: lý do quyết định.
5. docs/PRODUCT-AND-TEST.md: giả thuyết sản phẩm và kịch bản kiểm chứng.
6. README.md và mã nguồn hiện tại. Khi tài liệu khác code, ghi nhận chênh lệch, không đoán đã triển khai.

## Hai repo, chưa hợp nhất
- https://github.com/MaiLeac/vuong-quoc-loser: Python/SQLite, bản Antigravity, server 8888.
- https://github.com/MaiLeac/Loser-Kingdom-studio: React/TypeScript/Express, bản Google AI Studio, server 3000.
Hai repo có tính năng khác nhau. Người dùng muốn tận dụng điểm hay của cả hai, nhưng chưa chốt repo nền hay kế hoạch hợp nhất. Không ghi đè một repo bằng repo kia.

## Mục tiêu và cách làm
Giúp người hay trì hoãn bắt đầu một việc nhỏ và quay lại dễ dàng, với thế giới hài hước/RPG. Điện thoại là màn hình chính. App phải dễ sử dụng; không để người dùng mất cả ngày học tính năng.
Áp dụng đúng năm bước trong AGENTS.md: tìm việc tốn thời gian → thao tác gây chậm → cách bỏ thao tác rẻ nhất → chỉ xây phần cần → đo thời gian tiết kiệm.
Mỗi ý tưởng phải được phản biện: có hợp lý không, tiền lệ nào, cách đơn giản hơn, chi phí và cách kiểm chứng. Bằng chứng chưa có phải ghi “chưa đo”.

## Yêu cầu đã xác định
- Kiểm duyệt hình phạt: không gây hại sức khỏe, ép hoạt động thể chất/ingestion, bêu xấu hoặc hiệu ứng nguy hiểm. Chỉ dùng catalog đã duyệt, hậu quả trong game.
- Voice phải đúng ngôn ngữ nội dung. Không dùng giọng Anh đọc tiếng Việt khi thiếu voice Việt; hiển thị chữ và thông báo.
- Bỏ giả lập điện thoại: kiểm thử trên viewport và máy thật. Header nhỏ, không cắt/tràn và không che màn hình khi cuộn.
- Tai nạn, bệnh, hồi phục, khẩn cấp và chăm người thân phải ưu tiên nghỉ/cảm thông. Lý do mơ hồ hỏi lại. Không chửi thương tích, không bắt bằng chứng sức khỏe, không suy ra nói dối vì xin nghỉ nhiều lần.
- Nghỉ không tạo thành tích: không tự hoàn thành nhiệm vụ, thưởng XP/HP hoặc reset streak.
- Onboarding ngắn, có thể bỏ qua, chỉ hỏi dữ liệu cho bước tiếp theo; không bắt tài khoản/lịch/dàn nhân vật trước lần tập trung đầu.
- Test nhanh bằng dữ liệu tạm; test kỹ thuật, usability và hiệu quả thói quen là ba việc khác nhau.
- Review AI phải chỉ ra lỗi cụ thể và test tái hiện; nhiều AI đồng ý không thay được người dùng thật.

## Ý tưởng cần kiểm chứng, chưa chốt triển khai
- Google Calendar: người dùng đã hỏi tích hợp, sau đó yêu cầu cân nhắc giá trị. Prototype chỉ đọc đã nằm ở Python PR #2; chưa có OAuth thật. Không coi Calendar là điều kiện dùng app, không tự làm đồng bộ hai chiều.
- Voice Adam/giọng Google và vài voice phổ biến cho user lựa chọn theo ngôn ngữ. Chưa chốt provider, chi phí, voice ID hay quyền sử dụng; chưa tích hợp dịch vụ TTS trả phí.
- Ưu tiên châm biếm thâm thúy, “chửi như không chửi”; thay đổi cảm xúc: giận dỗi, khinh bỉ, bất lực, cảm thông, cổ vũ, trêu ghẹo theo tình huống và lựa chọn user. Không để ngẫu nhiên phá quy tắc bảo vệ sức khỏe.
- Dàn nhân vật: người anh động viên, ông thầy pháp triết lý, nhân vật dễ thương an ủi, cô nàng trêu, hàng xóm cà khịa. Những ví dụ nhân vật trong trò chuyện là nguồn cảm hứng, chưa chốt thiết kế/asset. Nhân vật gốc và prototype 2D là đề xuất, chưa quyết định 2D/3D.
- Một AI điều phối nhiều persona là phương án ít chi phí hơn nhiều AI; chưa chứng minh cần nhiều model/provider.
- Hộp bí ẩn cần đa dạng nội dung. Catalog đã mở rộng, nhưng chưa có hệ thống nhân vật hay âm thanh mới.
- Người dùng thích âm báo mạnh/đa dạng. Đang hoãn visual/còi; thiết kế tương lai cần nghe thử, tắt được, thời lượng/âm lượng có kiểm soát, không tự tăng âm lượng thiết bị.
- Nghiên cứu hành vi/tâm lý để chọn tính năng/visual; Fogg và SDT chỉ giúp tạo giả thuyết, không chứng minh app có hiệu quả.
- Tên dễ nhớ/tìm kiếm và trang Google Play hấp dẫn, có video. Chưa chọn tên cuối, kiểm tra trùng, phát hành store hay hứa thứ hạng đề xuất.

## Các điểm chưa quyết định
Repo nền cho sản phẩm hợp nhất; nhóm user đầu tiên; vấn đề tốn thời gian được đo; hosting/đăng nhập/PWA; onboarding chi tiết; nhà cung cấp AI/TTS và ngân sách; nhân vật/art; tên.
Luồng đề xuất: ghi một việc → phiên ngắn → làm → kết thúc/nghỉ → bước tiếp theo. Đây là hướng để thử, không phải UI đã triển khai.

## Quy tắc cập nhật tài liệu
Sau thay đổi có ý nghĩa, cập nhật HANDOFF và DECISIONS trong cùng commit với code. PROJECT chứa yêu cầu được chấp nhận; ý tưởng chưa chốt để riêng, không biến thành cam kết.
Ghi ngày, điều gì đổi, lý do, file liên quan, lệnh test và kết quả thực tế, hạn chế và bước tiếp theo. Không ghi secret, nội dung lịch cá nhân, bệnh sử hoặc database thật.
Tài liệu chung có bản sao ở cả hai repo: khi đổi nguyên tắc/yêu cầu chung phải cập nhật cả hai hoặc ghi rõ bản còn lại chưa đồng bộ. Không khẳng định có cơ chế tự đồng bộ.

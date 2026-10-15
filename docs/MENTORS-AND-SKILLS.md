# Hình mẫu và cây kỹ năng — yêu cầu và phương án thử
Ngày 15/10/2026. User yêu cầu thêm hình mẫu và tự xuất hiện cùng nhiệm vụ. Cây kỹ năng là đề xuất cần kiểm chứng, chưa có code tiến trình/phần thưởng.

## Danh sách 10 hình mẫu, không tạo bản trùng
Naval Ravikant: đòn bẩy; James Clear: hệ thống; Tim Ferriss: lược bỏ; Bruce Lee: thích nghi; David Goggins: bền bỉ.
Thêm Marcus Aurelius: điều kiểm soát được; Charlie Munger: tư duy ngược; Hồ Chí Minh: học hỏi và hướng dài hạn; Marie Curie: nghiên cứu kiên trì; Steve Jobs: tập trung sản phẩm.
Đây là cách diễn giải phẩm chất cho sản phẩm, không phải tiểu sử hoặc lời khuyên thực sự của người thật. Không nhập các giai thoại, câu trích dẫn hay số liệu của đoạn chat thành sự thật chưa kiểm chứng.

## Yêu cầu user vừa làm rõ
Hình mẫu là đội ngũ cố vấn chính, ưu tiên hơn hệ nhân vật loli/hàng xóm trước đây. Có thể dạy, trêu, khen, cổ vũ và phản biện theo tình huống.
User liên tưởng ROK: muốn nhân vật mạnh lên phản ánh chính năng lực ngoài đời, cây tài năng/goal/reward cá nhân hóa.
Hình mẫu giảm do dự, không phán xét giá trị con người; giữ nguyên câu hỏi: nguyên tắc phù hợp? điều kiểm soát? hành động hôm nay? kết quả thực tế?

## Đã triển khai ở Python
10 góc nhìn VI/EN viết sẵn; chọn cố định hoặc luân phiên. Tự xuất hiện dạng chữ sau API bắt đầu/hoàn thành task thành công, kèm tên task qua textContent.
Nhắc bằng thẻ inline có thể đóng, không popup/voice tự bật, không mở toàn bộ cài đặt. Có nút tắt auto lưu trên trình duyệt. Cà khịa nhẹ opt-in lưu riêng.
Nghỉ/sức khỏe dùng lời nhắc bảo vệ chung cho cả 10; không có lời mạt sát, giả giọng, trích dẫn bịa hoặc tự hại.
Chưa gọi AI, chưa avatar, chưa voice riêng, chưa cá nhân hóa ngữ cảnh sâu hoặc tự phát hiện mọi lý do/khẩn cấp. Không hook tự chửi vào API fail cũ vì Python chưa có policy sức khỏe đầy đủ. Mục “nghỉ” của bảng chỉ là câu nhắc, KHÔNG dừng timer/miễn phạt; gap recovery Python vẫn tồn tại.
Studio mới đồng bộ tài liệu. Xem HANDOFF để biết runtime và kiểm thử.

## Phản biện cây kỹ năng
Hứng thú mạnh lên trong game là quan sát cá nhân của user, không chứng minh sẽ học/làm tốt hơn ngoài đời.
Không dùng mục tiêu “nghiện app” làm tiêu chí. Game nên đưa user ra khỏi app để làm việc; không sao chép grind kéo dài, FOMO hoặc mất tiến trình vì nghỉ.
“Tăng điểm khắc kỷ hôm nay” không phải đo tính cách. Nghỉ đúng lúc/đổi mục tiêu có thể là quyết định tốt; không gọi kiệt sức là bền bỉ.
Sống giữa các persona không tự nâng năng lực/tiêu chuẩn; cần bài tập, phản hồi và kết quả. Quyền uy tên tuổi không thay bằng chứng.

## Prototype ít nhất để cân nhắc
Chỉ một cây cho một mục tiêu do user chọn, ba nút; chưa làm 10 cây:
- Bắt đầu: có sản phẩm nhỏ đầu tiên.
- Quay lại: mở lại việc dở và tiếp tục; nghỉ không mất nút.
- Vận dụng: làm bài/sản phẩm thực tế mới với tiêu chí đã chốt.
Tách XP “đã luyện” và mốc “đã thể hiện năng lực”. Tự khai được đánh dấu tự khai, không giả chống gian lận hoàn hảo.
Ví dụ Anh: thu âm ban đầu → sửa một điểm theo phản hồi → thử đề mới và so rubric. Không tự phong kỹ năng “hùng biện” vì bấm xong 10 task.
Ví dụ công nghệ: giải thích request/response → làm request trả dữ liệu đúng → dựng flow có xử lý lỗi. Bài thực tế mới là bằng chứng, không phải phút xem video.
Nhân vật là cách nhìn/cố vấn, cây kỹ năng thuộc năng lực user; tránh chia cùng một năng lực thành 10 bản chỉ để farm.
Phần thưởng: user tự chọn ít lựa chọn phù hợp, có thể là mở đoạn truyện/biểu cảm; chưa thiết lập tiền thật, loot box, gacha, leaderboard hoặc chỉ số nhân cách.
Chưa chốt công thức XP, ngưỡng mở nút hay reward. Không triển khai hệ lớn từ tài liệu này.

## Cách kiểm chứng
Thử bằng task và ghi chú hiện có một tuần trước: cố vấn có rút ngắn lúc do dự? tỉ lệ quay lại? đầu ra có tốt hơn? thời gian trong app/phiền có tăng?
Ghi nguồn, phản hồi và kết quả, không chỉ hoàn thành streak. 1 tuần chỉ để xem tính khả dụng, không chứng minh hiệu quả lâu dài.
Nghiên cứu gamification cho thấy các yếu tố có thể tác động khác nhau lên cảm giác năng lực/kết nối; không chứng minh cấu hình app này:
https://doi.org/10.1016/j.chb.2016.12.033

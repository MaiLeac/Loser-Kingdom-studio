# Nguyên tắc làm việc của người dùng

Áp dụng cho toàn bộ công việc app trong workspace này.

## Châm ngôn — phải thực hiện trước khi xây tính năng
1. Xác định việc nào đang tốn thời gian.
2. Tìm chính xác thao tác gây tốn thời gian.
3. Tìm cách loại bỏ thao tác đó với chi phí thấp nhất.
4. Chỉ xây thứ cần thiết để giải quyết vấn đề.
5. Đo xem thời gian thực sự tiết kiệm được bao nhiêu.

Không mặc định mỗi ý tưởng của người dùng là yêu cầu triển khai ngay. Góp ý về vấn đề thực, tiền lệ, phương án đơn giản hơn, chi phí và cách kiểm chứng; chỉ đề nghị xây khi cần. Phân biệt nghiên cứu/bằng chứng với giả thuyết sản phẩm. Không lấy đồng thuận của AI thay cho thử nghiệm người dùng.

## Định hướng sản phẩm
- Điện thoại là màn hình chính. Tối giản để người dùng không phải học một tỷ tính năng.
- Onboarding ngắn, có thể bỏ qua; chỉ hỏi dữ liệu cần cho bước tiếp theo. Không bắt đăng nhập, kết nối lịch, chọn dàn nhân vật hoặc khai bệnh sử trước phiên tập trung đầu tiên.
- Ưu tiên bắt đầu một việc nhỏ, tập trung, rồi quay lại dễ dàng. Visual/nhân vật/còi phức tạp làm sau.
- Châm biếm sâu cay về hành vi khi người dùng chọn; sức khỏe, tai nạn và hồi phục được ưu tiên. Không kết luận nói dối từ văn bản hoặc số lần xin nghỉ.
- Review AI phải trả về lỗi cụ thể, bằng chứng và test tái hiện; đa dạng vai phản biện nhưng không coi nhiều AI đồng ý là chứng minh đúng. Không gửi dữ liệu thật/secret sang dịch vụ AI khi chưa được phép.
- Kiểm thử tự động bằng dữ liệu giả lập/database tạm, không reset dữ liệu người dùng. Tách kỹ thuật, usability và hiệu quả thói quen; test xanh không đồng nghĩa sản phẩm hữu ích.
- Cân nhắc tên dễ nhớ/tìm được; chưa hứa thứ hạng đề xuất hoặc chọn tên chưa kiểm tra trùng.
- Mã local đang chạy phải được xác minh; merge GitHub không đồng nghĩa người dùng đang dùng bản mới. Sao lưu trước cập nhật và giữ server người dùng cần chạy.

## Bàn giao cho AI tiếp theo
Đọc docs/PROJECT.md, docs/HANDOFF.md và docs/DECISIONS.md trước khi sửa. Cập nhật tài liệu cùng commit có thay đổi đáng kể. Không giả định tính năng của repo còn lại có ở đây.

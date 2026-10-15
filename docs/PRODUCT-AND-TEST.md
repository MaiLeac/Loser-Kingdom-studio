# Loser Kingdom — nguyên tắc sản phẩm và test nhanh

Ngày 11/10/2026. Đây là định hướng và kế hoạch kiểm chứng, chưa phải tuyên bố đã triển khai onboarding hoặc đã chứng minh hiệu quả thay đổi thói quen.

## Châm ngôn của chủ dự án

1. Xác định việc nào đang tốn thời gian.
2. Tìm chính xác thao tác gây tốn thời gian.
3. Tìm cách loại bỏ thao tác đó với chi phí thấp nhất.
4. Chỉ xây thứ cần thiết để giải quyết vấn đề.
5. Đo xem thời gian thực sự tiết kiệm được bao nhiêu.

Đã lưu thành AGENTS.md trong workspace để các lượt làm việc sau áp dụng. Mỗi đề xuất cần ghi: người dùng/tình huống; thao tác đang gây chậm; bằng chứng hiện có; cách không cần code; bản nhỏ nhất; chi phí xây và dùng; cách đo; điều kiện giữ hoặc bỏ. Chưa có dữ liệu thì ghi “chưa đo”, không bịa số tiết kiệm.

Ví dụ: vấn đề có thể là “mất nhiều bước để bắt đầu”, không phải “thiếu Google Calendar”. Trước khi làm đồng bộ lịch, thử danh sách hôm nay và nút tiếp tục nhiệm vụ gần nhất. So sánh số thao tác và thời gian bắt đầu. Tính cả thời gian cài đặt, bảo trì và học dùng; app không được tiết kiệm 30 giây rồi lấy mất 10 phút cấu hình.

## Vòng lặp cốt lõi được đề xuất

Ghi một việc → chọn phiên ngắn → bắt đầu → kết thúc hoặc nghỉ → biết bước tiếp theo.

Trang đầu chỉ cần việc hiện tại, thời gian, Bắt đầu/Nghỉ và phản hồi ngắn. Chi tiết XP, rank, kho đồ, thống kê, voice, lịch, nhân vật nằm phía sau. Không ép nộp báo cáo dài cho mọi phiên chỉ để chứng minh với một app tự kỷ luật; cân nhắc tự đánh dấu trước, chế độ bằng chứng là tùy chọn nếu có nhu cầu rõ ràng.

Mục tiêu usability ban đầu do mình đề xuất, chưa được kiểm chứng: người mới bắt đầu phiên đầu trong 60 giây; quay lại việc gần nhất trong 10 giây; tìm được nghỉ/tắt voice mà không cần giải thích. Không tối ưu “ở trong app lâu”: mục tiêu là bắt đầu công việc và rời app để làm.

## Onboarding: làm được trước, hỏi thêm sau

Một màn hình:
- “Hôm nay muốn xử lý việc gì?” — nhập một dòng hoặc chọn ví dụ. Đây là dữ liệu cốt lõi.
- Phiên 5 / 10 / 25 phút, mặc định 5 phút cho lần đầu; đây là giả thuyết cần thử.
- Nút “Bắt đầu thử”. Dòng phụ: “Muốn nghỉ lúc nào cũng được.”

Lần đầu không bắt tạo tài khoản, kết nối Calendar, đặt avatar, điền bệnh sử, kể tất cả thói quen hoặc chọn cả dàn voice. Nếu muốn cá nhân hóa, cho một lựa chọn bỏ qua: “Nhắc nhẹ / cà khịa nhẹ”; có thể đổi sau. Đặt câu hỏi mới đúng lúc: sau vài phiên mới hỏi việc lặp hay thời điểm nhắc; bấm lịch mới hỏi kết nối lịch. Dùng ngôn ngữ bình thường cho nút hành động, chất hề nằm ở câu thoại ngắn.

NN/g khuyên hướng dẫn theo ngữ cảnh và để chi tiết hiện dần thay vì tutorial dài ngay đầu: [onboarding](https://www.nngroup.com/articles/onboarding-tutorials/), [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/). Luồng một màn hình ở trên là đề xuất riêng, không phải kết quả nghiên cứu của NN/g cho app này.

## Nghiên cứu hành vi: dùng mô hình để tạo giả thuyết

[Fogg Behavior Model](https://www.behaviormodel.org/home) mô tả hành vi cần động lực, khả năng thực hiện và lời nhắc gặp nhau cùng lúc. Ứng dụng đề xuất: giảm độ khó thao tác/bước đầu và nhắc đúng lúc, trước khi tăng độ gắt của lời chửi. Đây không phải bằng chứng rằng một nhân vật cụ thể sẽ làm người dùng chăm chỉ hơn.

[Self-Determination Theory](https://selfdeterminationtheory.org/the-theory/) nhấn mạnh tự chủ, năng lực và kết nối trong động lực. Ứng dụng đề xuất: user chọn giọng/độ gắt, thấy tiến bộ vừa sức, có nhân vật đồng hành; không dùng cảm giác bị kiểm soát làm cơ chế duy nhất. Châm biếm về hành vi khi user muốn, không gắn thất bại với giá trị con người. Lý do sức khỏe, tai nạn, khẩn cấp ưu tiên nghỉ và cảm thông.

Ba giả thuyết nên kiểm chứng:
1. Một bước bắt đầu nhỏ giúp bấm start nhanh hơn onboarding hỏi nhiều câu.
2. Phản hồi sâu cay vừa phải khiến người dùng muốn quay lại hơn mạt sát liên tục.
3. Một nhân vật dễ nhớ giúp tạo cảm giác đồng hành; nhiều nhân vật ngay đầu có thể làm loãng và tăng tải học dùng.

Phỏng vấn 3–5 người trong cùng nhóm mục tiêu, hỏi lần gần nhất họ trì hoãn thực sự: đang làm gì, kẹt ở thao tác nào, đã thử cách gì. Tránh câu “Bạn có thích app này không?” hoặc dẫn dắt “Voice AI sẽ giúp bạn đúng không?”. Chia test usability thành nhiều vòng nhỏ để sửa sớm; [NN/g về vòng test nhỏ](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/). Một nhóm nhỏ không đủ chứng minh hiệu quả thói quen hoặc phù hợp cho mọi nhóm người.

## Test nhanh

Runner Test-nhanh.cmd nằm trong outputs của workspace Codex gốc, không nằm trong docs của repo. Nếu ở máy khác, dùng các lệnh test trong HANDOFF.md. Nó chạy các suite đã có của hai bản repo bằng database tạm và dữ liệu giả lập, ghi quick-test-report.txt. Không reset database app đang dùng, không nộp sự kiện Google thật, không gửi dữ liệu sức khỏe lên Gemini. Cần Python, Node và dependency Studio đã cài trên máy này. Nếu chuyển sang máy khác, cần setup repo và dependency trước.

Test tự động kiểm tra kỹ thuật/quy tắc, không kết luận UI đã dễ dùng. Chỉ chạy những suite liên quan khi code thay đổi; chạy toàn bộ smoke trước bản phát hành. AI copy live, Google OAuth thật và chất lượng loa/voice cần test riêng. Quan trọng: luồng nghỉ cảm thông nằm ở bản sửa Studio chưa merge, chưa được hợp nhất vào bản Python ở cổng 8888; test xanh của cả hai repo không chứng minh bản đang dùng có tất cả tính năng. Đây là khoảng trống cần xử lý trước phát hành.

Kịch bản điện thoại khoảng 10 phút, dùng môi trường test riêng:

| Mã | Thao tác | Điều kiện đạt |
|---|---|---|
| U01 | Người chưa xem hướng dẫn tạo 1 việc, bắt đầu | Tìm được đường đi; ghi thời gian và lần hỏi trợ giúp |
| U02 | Cuộn ở màn hình nhỏ, mở bàn phím | Không cắt nút, không tràn ngang, header không chắn nội dung |
| U03 | Hết phiên, báo chưa xong | Có bước tiếp theo rõ; không mất task |
| U04 | Tự nhận lướt giải trí | Nhắc về hành vi, hậu quả ảo đúng một lần, không chỉ dẫn hành xác |
| U05 | Nhập “ngã xe, cần nghỉ”, kể cả chọn nhầm trì hoãn | Được nghỉ, không thưởng/phạt, không chế nhạo thương tích — release blocker nếu fail |
| U06 | Mất mạng/API lỗi | Không phạt do lỗi hệ thống; vẫn có đường nghỉ/quay lại |
| U07 | Tắt voice trong khi đang đọc/chờ | Dừng và không bật lại bất ngờ; thiếu voice Việt không dùng giọng Anh |
| U08 | Reload/đóng rồi mở lại | Giữ task và trạng thái đúng, không nhân đôi điểm/thử thách |

Không cần mỗi người test tất cả. Người dùng mới làm U01–U03; người test kỹ thuật làm U04–U08. Đưa mục tiêu, không hướng dẫn từng nút: “Bạn muốn làm bài trong 5 phút, hãy bắt đầu”. Quan sát họ kẹt ở đâu, sửa một cụm lỗi rồi thử tiếp.

Đo trước/sau bằng cùng kịch bản và nhóm tương đương: thời gian tạo/start, số lần chạm, số lỗi/mất dữ liệu, tỷ lệ cần trợ giúp. Khi đã có người dùng thật mới thêm tỷ lệ quay lại và số phiên hữu ích. Không kết luận nhân quả từ vài người hoặc từ một tuần có nhiều yếu tố đổi cùng lúc.

## Review với AI

Trước tính năng mới, cung cấp cùng một problem brief cho vai phản biện sản phẩm và vai kiểm thử/kỹ thuật. Yêu cầu đầu ra: vấn đề cụ thể, bằng chứng, mức độ ảnh hưởng, test tái hiện và cách ít code hơn. Trước visual mới, yêu cầu đánh giá thứ bậc thị giác, độ đọc được trên điện thoại và thao tác chính.

Bộ tình huống đối kháng cho lời thoại: trì hoãn tự nhận; lý do mơ hồ; tai nạn/ốm/kiệt sức/chăm người thân; chọn sai nhóm; xin nghỉ nhiều lần; lệnh trong lời biện hộ đòi sửa quy tắc; tiếng Việt không dấu; câu Anh/Việt trộn; đầu vào rỗng/dài; API timeout. Chấm riêng quyết định và câu chữ. “Không chế nhạo sức khỏe, không phạt lỗi mạng, không thưởng thành tích cho xin nghỉ” là điều kiện cứng.

Nếu nhiều model cùng thích một ý tưởng, vẫn cần test người thật. Không hỏi lại cùng một câu đến khi nhận câu trả lời mình muốn. Chỉ review lại khi có thay đổi, lỗi hoặc bằng chứng mới; không chạy AI nền liên tục chưa có mục tiêu. Các review này là quy trình đề xuất, chưa có lịch tự động hay lời xác nhận từ model ngoài.

## Tên và Google Play

Tên cần vừa có dấu ấn vừa cho người mới biết công dụng. “Loser Kingdom” có cá tính nhưng có thể khó liên tưởng đến app tập trung; cần test phản ứng của đúng nhóm user, kể cả người không thích tự gọi mình loser. Chưa có cơ sở chọn tên thắng hoặc bảo đảm được đề xuất.

Hai hướng mẫu để test, chưa kiểm tra trùng/khả năng dùng:
- Giữ thế giới: “Loser Kingdom: Focus RPG”.
- Tên Việt gợi chức năng: “Làm Đi: Tập Trung” hoặc “Vương Quốc Tập Trung”.

Đưa tên/icon cho 5 người xem vài giây, hỏi “Bạn nghĩ nó làm gì?” và “Bạn nhớ tên nào?”. Kiểm tra trùng tên/tìm kiếm trước khi chốt. [Google Play giới hạn title 30 ký tự](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en-GB). Không nhồi từ khóa hoặc hứa xếp hạng.

Screenshot đầu cho thấy tác vụ chính, screenshot sau là tiến bộ/nhân vật; video minh họa một hành trình thật từ chọn việc đến phản hồi, không liệt kê mọi chức năng. Đây là đề xuất nội dung, chưa sản xuất asset. Sau khi có traffic, có thể test icon/screenshot/mô tả bằng [Store Listing Experiments](https://support.google.com/googleplay/android-developer/answer/12053285?hl=en); đây không bảo đảm thứ hạng tìm kiếm hay được đề xuất.

## Ý tưởng bị sao chép

Không cần giải quyết nỗi lo này bằng cách đóng kín mọi cuộc thử nghiệm. Giữ credential, dữ liệu user và tài liệu chưa cần chia sẻ riêng; chia sẻ đủ luồng để có phản hồi. Điều cần kiểm chứng lúc này là mình có giảm một khó khăn thật hay không. Chất riêng có thể nằm ở câu thoại, nhân vật, nhịp trải nghiệm và chất lượng thực thi — đó là hướng sản phẩm, không phải lời bảo đảm người khác không sao chép được.

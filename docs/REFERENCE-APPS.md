# App tham khảo và hướng làm Loser Kingdom

Tra cứu ngày 11/10/2026 trên trang chính thức. Các cột “nên thử” và quyết định kiến trúc là đề xuất cho sản phẩm của mình.

| App | Điểm đáng xem | Thử trong 15–30 phút |
|---|---|---|
| [Habitica](https://www.habitica.com/) | Habits/Dailies/To-Dos, avatar, XP, đồ và nhiệm vụ RPG | Tạo 1 thói quen, 1 việc lặp và 1 task; xem hoàn thành ảnh hưởng nhân vật thế nào |
| [LifeUp](https://www.lifeupapp.fun/index.html) | RPG task, kỹ năng, EXP, tiền, phần thưởng và rương; Android | Tự tạo 1 phần thưởng và 1 rương; xem khả năng tự thiết kế luật game |
| [Finch](https://finchcare.com/about-finch) | Nhân vật đồng hành khuyến khích các bước chăm sóc bản thân | Đặt 1 mục tiêu nhỏ; xem phản hồi tích cực và cảm giác muốn quay lại |
| [Structured](https://structured.app/) | Gom việc và lịch thành timeline trong ngày | Xếp 3 việc quanh 1 cuộc hẹn; đánh giá màn hình điện thoại có dễ nhìn không |
| [TickTick](https://ticktick.com/?language=en_us) | Task, lịch, Pomodoro, habit cùng một app | Thử việc lặp, focus và chuyển góc nhìn lịch; ghi lại cái gì quá nhiều nút |
| [Forest](https://forestapp.cc/) | Biến phiên tập trung thành tiến trình cây/rừng | Chạy 1 phiên; đánh giá phản hồi hình ảnh có thú vị hơn HP không |
| [Super Productivity](https://super-productivity.com/integrations/google-calendar/) | Timeboxing và tích hợp Google Calendar | Xem planner, lịch và task cạnh nhau; tích hợp OAuth Calendar hiện cần bản native, không phải browser app |

| [Spirit City: Lofi Sessions](https://store.steampowered.com/app/2113850/Spirit_City_Lofi_Sessions/) | Tham khảo nhân vật, spirit và không gian cá nhân; đây là bản desktop | Xem visual, cảm giác ở cùng nhân vật và cách tùy biến phòng |

Ưu tiên Habitica → LifeUp → Finch → Structured để đánh giá ba trụ cột RPG, đồng hành và kế hoạch. Forest/TickTick/Super Productivity giúp kiểm tra timer và lịch. Khi trải nghiệm, ghi 3 điều thích, 3 điều bực và 1 tính năng muốn đưa vào Loser Kingdom; không cần sao chép mọi thứ.

## Điện thoại

Tiếp tục dùng web nhưng thiết kế và kiểm tra điện thoại ngay từ đầu: header nhỏ, thao tác chạm, bàn phím, safe area và cuộn. Bản hiện tại vẫn là server Python chạy trên laptop; localhost trên điện thoại không phải laptop.

Bước kế tiếp để sử dụng độc lập: server HTTPS online, đăng nhập và dữ liệu theo người dùng, rồi PWA thêm vào màn hình chính. [MDN: điều kiện cài PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). Bản này chưa có PWA/offline hoàn chỉnh. Tính năng nền/chặn app khác cần đánh giá riêng trên Android/iOS; không hứa web sẽ tự làm được.

## Nhân vật và voice — định hướng, chưa triển khai

Một AI điều phối có thể chọn persona và cảm xúc từ tình huống: thành công → khích lệ/trêu nhẹ; trì hoãn tự nhận → châm biếm sâu cay; tai nạn/bệnh → cảm thông và nghỉ; lý do chưa rõ → hỏi lại. Cho phép người dùng tắt từng nhân vật và điều chỉnh độ gắt. Không để ngẫu nhiên chọn mạt sát trong tình huống sức khỏe.

Tách cấu hình thành persona, ngôn ngữ, voice provider/voice ID và cảm xúc. Giọng đọc không quyết định nội dung: Adam có thể động viên; giọng nữ Việt cũng có thể châm biếm. Nếu Adam bạn nói là voice ElevenLabs, cần chọn đúng voice ID và model hỗ trợ ngôn ngữ; không xem mọi model “multilingual” là hỗ trợ Việt. [Tài liệu ngôn ngữ ElevenLabs](https://elevenlabs.io/docs/help-center/other/what-languages-do-you-support), [voice](https://elevenlabs.io/docs/overview/capabilities/voices). Voice của thiết bị có thể khác giữa máy tính và điện thoại.

Đề xuất prototype 2D với vài biểu cảm/motion đơn giản và phụ đề, rồi mới quyết định 3D. Nhân vật gốc như ông thầy pháp triết lý, người anh, cô nàng hay trêu, hàng xóm cà khịa dễ tùy biến theo thế giới riêng. Không cần triển khai nhiều nhà cung cấp AI trước khi biết một AI thiếu ở đâu.

Âm thanh tương lai: lựa chọn kiểu còi, nghe thử, mức âm lượng và thời lượng rõ ràng, luôn có nút tắt, không tự tăng âm lượng thiết bị. Tách mức kịch tính khỏi độ lớn. Hiện chưa thêm còi mới theo quyết định để visual/function sau.

## Google Calendar đã chuẩn bị

Đã thêm OAuth quyền chỉ đọc, xem lịch chính 7 ngày, nhập từng sự kiện không trùng thành nhiệm vụ pending. Thời điểm được lưu trong mô tả. Đây là bản sao, không đồng bộ hai chiều và không tự hoàn thành/phạt theo lịch. Token chỉ ở RAM server, phải kết nối lại khi hết hạn hoặc restart. Bản OAuth chỉ localhost một người dùng; mobile online cần HTTPS và đăng nhập riêng.

Để thử thật cần chủ app tạo OAuth client Web ở Google Cloud, bật Calendar API, thêm test user và redirect URI `http://localhost:8888/api/calendar/callback`, rồi đặt GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET trong môi trường server. Không gửi secret lên GitHub hoặc nhập vào frontend. [Google hướng dẫn OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [scope Calendar](https://developers.google.com/workspace/calendar/api/auth).

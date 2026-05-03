# HƯỚNG DẪN TÁI TẠO (REPLICATE) & GIẢI THÍCH CHI TIẾT PROJECT HOTEL BOOKING APP (MOBILE)

File này cung cấp cho bạn một **Prompt chuẩn xác nhất** để bạn có thể gửi cho bất kỳ AI nào để yêu cầu chúng code lại một Project giống hệt 100% repo hiện tại. Đồng thời giải thích cặn kẽ cấu trúc mã nguồn bên dưới.

---

## PHẦN 1: PROMPT TẠO LẠI PROJECT BẰNG AI

```text
Bạn là một Mobile Developer chuyên nghiệp. Nhiệm vụ của bạn là viết toàn bộ code cho dự án "Hotel Booking App" (React Native Expo, Node.js Express, MySQL, Redux, Axios). Dự án yêu cầu giao diện mobile cực kỳ hiện đại, lấy cảm hứng từ app "HotelTonight" (Dark Mode, Nút nhấn màu Neon Orange, Card bo góc mượt mà).

Yêu cầu chi tiết từng phần:

1. DATABASE (MySQL): 
- Viết file database.sql tạo DB 'hotel_booking'.
- Bảng rooms: room_id, room_number, room_type, description.
- Bảng customers: customer_id, full_name, phone_number, email.
- Bảng bookings: booking_id, room_id, customer_id, check_in_date, check_out_date, status (Available, Booked, Checked-in).

2. BACKEND (Node.js + Express):
- Khởi tạo Express app chạy ở port 5000, kết nối MySQL.
- Các API trả về JSON:
  + GET /api/dashboard: Dùng LEFT JOIN gộp thông tin rooms, bookings, và customers lại. Gom nhóm (reduce) dữ liệu booking vào từng phòng. Quan trọng: Format ngày bằng DATE_FORMAT() để tránh lỗi timezone.
  + POST /api/bookings: Thêm customer mới rồi tạo booking status "Booked".
  + PUT /api/bookings/:id/status: Cập nhật status thành "Checked-in".
  + DELETE /api/bookings/:id: Xóa booking.

3. FRONTEND (React Native - Expo):
- Tạo app Expo mới. Cấu trúc: src/components/, src/screens/, src/redux/, App.js (ở root).
- Redux: Tạo store.js, roomSlice.js dùng createAsyncThunk và Axios để gọi GET /api/dashboard. Nhớ cấu hình API_URL dùng 10.0.2.2 cho Android và localhost cho iOS.
- Màn hình (src/screens/DashboardScreen.js): 
  + Quản lý state 'role' (Customer, Receptionist, Manager) bằng hệ thống TouchableOpacity (Tabs) nằm ngang, thiết kế bo tròn. Sử dụng ScrollView bao bọc nội dung.
- Components (src/components/):
  + Calendar.js: Hiển thị dạng lưới ma trận cuộn ngang (Horizontal ScrollView). Cột trái là tên phòng, các cột tiếp theo là 7 ngày.
  + RoomSlot.js: Hiển thị các khối TouchableOpacity đại diện cho Slot đặt phòng. Tô màu: Xanh lá (Trống), Hổ phách (Đã đặt), Xanh dương (Đang ở).
  + Xây dựng Component Modal riêng biệt bằng <Modal> của React Native thay cho window.alert. Modal có form điền Text, hiệu ứng slide từ dưới lên, background mờ tối.
  + Logic tương tác theo Role (Gửi Axios request rồi dispatch Redux load lại).
```

---

## PHẦN 2: GIẢI THÍCH CHI TIẾT CẤU TRÚC VÀ LUỒNG CHẠY CỦA REPO

Dự án này là một hệ thống Full-stack Mobile hoàn chỉnh.

### 1. Cơ sở dữ liệu (Database - MySQL)
- Bảng trung gian `bookings` kết nối `rooms` và `customers`.

### 2. Máy chủ Backend (Node.js & Express)
- Xử lý API RESTful cho Mobile App gọi đến. Xử lý triệt để bài toán múi giờ bằng SQL `DATE_FORMAT()`.

### 3. Giao diện Mobile (React Native + Redux Toolkit)
- **Thư mục `src/redux/`**: "Trái tim" quản lý luồng dữ liệu (State Management).
  - **`store.js`**: Kho lưu trữ tổng (`configureStore`).
  - **`roomSlice.js`**: Sử dụng `createAsyncThunk` kết hợp `Axios` để gọi API. Chú ý xử lý `Platform.OS === 'android'` để tự đổi IP từ localhost sang `10.0.2.2`.
- **Thư mục `src/screens/`**: 
  - `DashboardScreen.js`: Màn hình chứa Container `SafeAreaView` và `ScrollView`. Quản lý state Role.
- **Thư mục `src/components/`**: 
  - `Calendar.js`: Sử dụng `ScrollView horizontal` tạo ra trải nghiệm vuốt lịch sang ngang mượt mà bằng ngón tay.
  - `RoomSlot.js`: Xử lý nhấn (chạm) bằng `TouchableOpacity`. Nếu hợp lệ sẽ render ra `<Modal>` chứa Form (Sử dụng `TextInput` của React Native) để nhập Tên, SĐT. Khi bấm xác nhận, nó trigger Axios kết nối tới Backend Nodejs. Dữ liệu thay đổi sẽ tức thì phản hồi lên giao diện nhờ Redux state.

### 4. Triết lý UI/UX Mobile
- Giao diện được tối ưu hóa cho Mobile theo phong cách HotelTonight với nền Tối (Dark Mode), text có độ tương phản cao, và các nút bấm bo góc 12px-20px thân thiện với ngón tay. Đảm bảo trải nghiệm vuốt (swipe) và chạm (tap) liền mạch.

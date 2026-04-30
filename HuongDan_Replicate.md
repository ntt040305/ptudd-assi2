# HƯỚNG DẪN TÁI TẠO (REPLICATE) & GIẢI THÍCH CHI TIẾT PROJECT HOTEL BOOKING APP

File này cung cấp cho bạn một **Prompt chuẩn xác nhất** để bạn có thể gửi cho bất kỳ AI nào (như tôi, ChatGPT, Claude) để yêu cầu chúng code lại một Project giống hệt 100% repo hiện tại. Đồng thời giải thích cặn kẽ cấu trúc mã nguồn bên dưới.

---

## PHẦN 1: PROMPT TẠO LẠI PROJECT BẰNG AI
*Hãy copy toàn bộ đoạn text trong khung bên dưới và gửi cho AI nếu bạn muốn làm lại project này từ đầu.*

```text
Bạn là một Full-stack Developer chuyên nghiệp. Nhiệm vụ của bạn là viết toàn bộ code cho dự án "Hotel Booking App" (ReactJS Vite, Node.js Express, MySQL, Redux, Axios). Dự án yêu cầu giao diện cực kỳ hiện đại, lấy cảm hứng từ app "HotelTonight" (Dark Mode, Xanh đen Gradient, Glassmorphism, Nút nhấn màu Neon Orange, Card bo góc mượt mà).

Yêu cầu chi tiết từng phần:

1. DATABASE (MySQL): 
- Viết file database.sql tạo DB 'hotel_booking'.
- Bảng rooms: room_id, room_number, room_type (standard, deluxe, suite), description.
- Bảng customers: customer_id, full_name, phone_number, email.
- Bảng bookings: booking_id, room_id, customer_id, check_in_date, check_out_date, status (Available, Booked, Checked-in).
- Insert dữ liệu mẫu vào cả 3 bảng.

2. BACKEND (Node.js + Express):
- Khởi tạo Express app chạy ở port 5000, kết nối với MySQL qua 'mysql2'.
- Các API trả về JSON:
  + GET /api/dashboard: Dùng LEFT JOIN để gộp thông tin rooms, bookings, và customers lại. Gom nhóm (reduce) dữ liệu booking vào từng phòng. Cực kỳ quan trọng: Format ngày bằng DATE_FORMAT() để tránh lỗi timezone.
  + POST /api/bookings: Thêm customer mới vào DB rồi mới tạo booking status "Booked".
  + PUT /api/bookings/:id/status: Cập nhật status thành "Checked-in".
  + DELETE /api/bookings/:id: Xóa booking (cho check-out hoặc hủy).

3. FRONTEND (ReactJS - Vite):
- Cấu trúc thư mục bắt buộc bên trong src/: components/, screens/, redux/, App.jsx, main.jsx.
- Redux: Tạo store.js, roomSlice.js dùng createAsyncThunk và Axios để gọi GET /api/dashboard. Toàn bộ dữ liệu hiển thị phải lấy từ Redux.
- Màn hình (screens/DashboardScreen.jsx): 
  + Quản lý state 'role' (Customer, Receptionist, Manager) thông qua thẻ Select thiết kế dạng Glassmorphism đẹp mắt.
- Components (components/):
  + Calendar.jsx: Hiển thị dạng lưới ma trận gồm: Tên phòng, Loại phòng, 7 Ngày. Sử dụng các thẻ <img> để hiển thị hình minh họa cho phòng standard/deluxe/suite.
  + RoomSlot.jsx: Hiển thị các khối (Pills) đại diện cho Slot đặt phòng. Tô màu động: Xanh lá mờ (Trống), Hổ phách/Vàng mờ (Đã đặt), Xanh dương (Đang ở).
  + Xây dựng một Custom Modal UI cao cấp bên trong RoomSlot (có hiệu ứng blur, làm tối nền) thay cho window.prompt.
  + Logic tương tác theo Role: 
    > Customer: Bấm ô Trống -> Mở form điền Tên, SĐT -> Gọi POST API -> Tải lại Redux.
    > Receptionist: Bấm ô Đã đặt -> Hỏi Check-in -> Gọi PUT API. Bấm ô Đang ở -> Hỏi Check-out -> Gọi DELETE API.
    > Manager: Bấm ô có khách -> Hỏi Hủy -> Gọi DELETE API.
- CSS (index.css): Cung cấp @keyframes slideUp, modalFadeIn, các class .glass-panel và biến gradient Dark Mode cao cấp.

Hãy code chi tiết từng file, không bỏ sót dòng nào và đảm bảo tính Real-time (thao tác xong gọi dispatch reload ngay).
```

---

## PHẦN 2: GIẢI THÍCH CHI TIẾT CẤU TRÚC VÀ LUỒNG CHẠY CỦA REPO HIỆN TẠI

Dự án này là một hệ thống Full-stack hoàn chỉnh, gồm 3 khối kiến trúc chính. Dưới đây là phân tích chức năng của từng file trong Project:

### 1. Cơ sở dữ liệu (Database - MySQL)
- **`database.sql`**: Chứa toàn bộ câu lệnh khởi tạo. Thiết kế theo dạng chuẩn hóa (Normalization). `bookings` đóng vai trò là bảng trung gian kết nối `rooms` (1 phòng có thể có nhiều bookings ở các ngày khác nhau) và `customers` (Thông tin người đặt).

### 2. Máy chủ Backend (Node.js & Express)
- **`backend/server.js`**: 
  - Khởi tạo Server lắng nghe tại cổng `5000`. Cấu hình `CORS` để cho phép React ở cổng `5173` gọi qua.
  - API trọng tâm là `GET /api/dashboard`. Thay vì bắt Frontend gọi 3 lần cho 3 bảng, API này sử dụng `LEFT JOIN` nối cả 3 bảng lại thành một bảng dữ liệu duy nhất. Hàm `.reduce()` trong Javascript sau đó được sử dụng để gom nhóm các booking thuộc về cùng 1 phòng, tạo ra cấu trúc JSON dạng cây để Frontend dễ dàng dùng `map()` vẽ ra giao diện.
  - Có sử dụng `DATE_FORMAT()` trực tiếp trong câu Query để khử lỗi Múi giờ (Timezone) kinh điển của MySQL & Javascript.

### 3. Giao diện Frontend (ReactJS + Redux Toolkit)
- **Thư mục `public/`**: Chứa 3 bức ảnh minh họa chất lượng cao cho phòng (standard, deluxe, suite) để React lấy ra sử dụng.
- **Thư mục `src/redux/`**: "Trái tim" quản lý luồng dữ liệu (State Management) của toàn bộ ứng dụng, được xây dựng theo chuẩn hiện đại của **Redux Toolkit (RTK)**.
  - **`store.js`**: Khởi tạo kho lưu trữ tổng (`configureStore`), đóng vai trò như một cơ sở dữ liệu ở phía Frontend. Kho này gom nhóm các Reducer (như `rooms`, `bookings`) lại và được bọc ngoài cùng ứng dụng thông qua `<Provider store={store}>` trong file `App.jsx`.
  - **`roomSlice.js`**: File quan trọng nhất xử lý logic kết nối API và cập nhật trạng thái lịch đặt phòng.
    + **AsyncThunk (`fetchDashboardData`)**: Sử dụng `createAsyncThunk` kết hợp `Axios` để gọi API `GET /api/dashboard` một cách bất đồng bộ. Đây là cầu nối giữa Backend và Redux.
    + **State Shape**: Trạng thái được thiết kế cực kỳ chặt chẽ với 3 biến: `data` (chứa mảng dữ liệu thật), `status` (chu kỳ tải: `idle` ➔ `loading` ➔ `succeeded` hoặc `failed`), và `error` (lưu mã lỗi nếu server sập).
    + **extraReducers**: Tự động "lắng nghe" các giai đoạn của Promise khi gọi API (Pending, Fulfilled, Rejected) để gán lại giá trị cho biến `status` và `data`. Nhờ vậy, UI có thể dễ dàng hiển thị chữ "Đang tải dữ liệu lịch..." một cách tự động.
  - **Tích hợp vào UI (Hooks)**: Các Component như `DashboardScreen` dùng hook `useSelector` để móc dữ liệu từ kho Redux ra để render. Khi người dùng thao tác ở `RoomSlot` (như nhấn Check-in), nó gọi API báo Backend thay đổi DB, rồi gọi `dispatch(fetchDashboardData())` để bắt Redux tải lại kho chứa, từ đó lưới lịch tự động đổi màu theo dữ liệu mới mà không cần F5.
- **Thư mục `src/screens/`**: 
  - `DashboardScreen.jsx`: Màn hình cha cao nhất. Nơi này kiểm soát việc *Chọn quyền (Role)* bằng state. Quyền này sau đó được truyền xuống `Calendar` bằng Props.
- **Thư mục `src/components/`**: 
  - `Calendar.jsx`: Chịu trách nhiệm render bảng lưới. Tính toán logic so sánh `date >= checkIn && date < checkOut` để nhét đúng `booking` vào đúng ô vuông ngày tháng trên lịch.
  - `RoomSlot.jsx`: Component quan trọng và phức tạp nhất. Nó chứa Giao diện 1 ô vuông nhỏ trên lưới, đồng thời chứa luôn cả hệ thống **Custom Modal UI** cực kỳ xịn sò. Khi user click vào, hàm `handleSlotClick` sẽ kiểm tra Role hiện tại là gì để hiện Modal tương ứng (Đặt phòng, Check-in, Hủy). Khi người dùng bấm xác nhận trên Modal, Axios sẽ bắn API xuống DB, sau khi DB lưu xong, nó dùng Redux `dispatch` để load lại danh sách phòng mới nhất (Tạo cảm giác Real-time).

### 4. Triết lý UI/UX
- **HotelTonight Vibe**: Giao diện được ép toàn bộ về Dark Mode (Background Gradient đen-xanh lồng nhau). Các thẻ dùng `backdrop-filter: blur(16px)` tạo cảm giác kính mờ (Glassmorphism). Màu Neon Orange `#ff5a5f` được dùng cho các nút quan trọng nhất (Call To Action).
- Tối ưu hóa trải nghiệm tương tác với các hiệu ứng `:hover` nâng nhẹ phần tử (`translateY`) thay vì chỉ là các form HTML khô cứng truyền thống.

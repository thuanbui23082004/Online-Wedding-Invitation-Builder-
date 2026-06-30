# 💍 DearLove - Online Wedding Invitation Builder (Frontend)

DearLove là nền tảng trực tuyến giúp các cặp đôi tự tay thiết kế, quản lý và chia sẻ thiệp cưới di động (mobile invitation cards) cao cấp, lãng mạn và tương tác hai chiều với khách mời.

---

## ✨ Tính Năng Chính (Features)

*   **📊 Overview Dashboard**: Bảng điều khiển trực quan thống kê lượt truy cập, biểu đồ số lượng khách dự đám cưới (RSVP), cùng tổng hợp lời chúc và quà mừng mới nhất.
*   **✉️ Quản lý thiệp mời (MyCards)**:
    *   Tự do khởi tạo thiệp mới từ khung vẽ thiết kế trống (Blank Canvas).
    *   Sử dụng thư viện bản mẫu chuyên nghiệp (Templates).
*   **💬 Quản lý lời chúc (Wishes)**: Xem danh sách và kiểm duyệt tất cả những tâm tư, lời chúc tốt đẹp nhất gửi đến cô dâu & chú rể.
*   **✅ Xác nhận tham dự (RSVP)**: Theo dõi danh sách khách tham dự tiệc, đi kèm với số lượng người đi cùng cụ thể để ước tính cỗ cưới chính xác.
*   **🎁 Nhận quà mừng trực tuyến (Gifts)**: Theo dõi danh sách quà tặng và tiền mừng cưới thông qua cổng thanh toán/mã QR trực tuyến trên thiệp di động.
*   **✍️ Đóng góp ý kiến (Feedback)**: Hòm thư tương tác trực tiếp với nhà phát triển để đề xuất tính năng và tối ưu hóa hệ thống.
*   **🔔 Popup Thông báo thông minh**: Tích hợp chuông thông báo nổi tại chân Sidebar trái cập nhật realtime các lời chúc, RSVP và quà mừng mới.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Core**: React 19 + TypeScript.
*   **Bundler**: Vite.
*   **Styling**: Tailwind CSS + Vanilla CSS.
*   **Icons**: Lucide React + React Icons (`BsEnvelopePaperHeart`).
*   **Routing**: React Router DOM (v6).
*   **Biểu đồ**: Recharts (để hiển thị thống kê biểu đồ cột/tròn trong Overview).

---

## 📂 Cấu Trúc Thư Mục (Folder Structure)

```text
wedding-frontend/
├── public/                # Tài nguyên tĩnh (Fonts, Ảnh nền đám cưới)
├── src/
│   ├── assets/            # Ảnh cưới, hình vẽ minh họa
│   ├── components/        # Components dùng chung (Footer, Navbar, Form elements)
│   ├── features/          # Các module tính năng chính
│   │   └── dashboard/     # Các trang Dashboard điều khiển:
│   │       ├── DashboardLayout.tsx      # Khung layout Dashboard (Sidebar trái + Header)
│   │       ├── NotificationPopup.tsx    # Popup thông báo nổi ở góc trái dưới
│   │       ├── Overview.tsx             # Trang tổng quan số liệu thống kê
│   │       ├── MyCards.tsx              # Quản lý thiệp cưới của cá nhân
│   │       ├── AccountProfile.tsx       # Quản lý hồ sơ cá nhân
│   │       ├── Wishes.tsx               # Danh sách lời chúc đám cưới
│   │       ├── RSVP.tsx                 # Danh sách khách mời xác nhận dự
│   │       ├── ReceivedGifts.tsx        # Danh sách phong bì/quà mừng
│   │       └── Feedback.tsx             # Hòm thư đóng góp ý kiến
│   ├── pages/             # Các trang độc lập (Editor thiết kế thiệp, trang hiển thị thiệp mời)
│   ├── App.tsx            # Cấu hình Routing chính toàn dự án
│   ├── index.css          # Cấu hình CSS toàn cục & Custom Font
│   └── main.tsx           # Entry point khởi tạo React
├── tailwind.config.js     # Cấu hình Tailwind CSS
├── vite.config.ts         # Cấu hình Vite bundler
└── package.json           # Danh sách các gói thư viện
```

---

## 🚀 Hướng Dẫn Cài Đặt (Installation)

### 1. Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (Khuyên dùng phiên bản >= 18).
*   Đã cài đặt **npm** hoặc **yarn**.

### 2. Cài đặt các gói phụ thuộc
Di chuyển vào thư mục frontend và cài đặt dependencies:
```bash
cd wedding-frontend
npm install
```

### 3. Khởi chạy dự án ở chế độ Phát triển (Development)
Khởi động máy chủ dev cục bộ:
```bash
npm run dev
```
Truy cập trang web tại địa chỉ mặc định: [http://localhost:5173](http://localhost:5173)

### 4. Biên dịch hệ thống (Build Production)
Đóng gói mã nguồn để triển khai lên môi trường Production:
```bash
npm run build
```
Sản phẩm đầu ra sẽ nằm trong thư mục `/dist`.

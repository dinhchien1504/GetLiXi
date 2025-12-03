# 🧧 Web Quay Lì Xì May Mắn

Web app quay số random tiền lì xì với Next.js, lưu kết quả vào Google Sheets thông qua Google Apps Script.

## ✨ Tính năng

- 🎰 Quay random tiền lì xì từ 5k - 500k
- 📝 Nhập tên Instagram trước khi quay
- 🎨 Animation đẹp mắt với Framer Motion
- 💾 Tự động lưu kết quả vào Google Sheets
- 📱 Responsive design, hoạt động tốt trên mọi thiết bị

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Setup Google Apps Script

#### Bước 1: Tạo Google Sheet
1. Vào [Google Sheets](https://sheets.google.com)
2. Tạo một sheet mới (ví dụ: "Kết quả Lì Xì 2025")

#### Bước 2: Tạo Apps Script
1. Trong Google Sheet, vào **Extensions** → **Apps Script**
2. Xóa code mặc định và copy toàn bộ nội dung file `google-apps-script.js` vào
3. Lưu lại (Ctrl + S)

#### Bước 3: Deploy Web App
1. Click **Deploy** → **New deployment**
2. Click biểu tượng ⚙️ bên cạnh "Select type" → chọn **Web app**
3. Cấu hình:
   - **Description**: "Lucky Money API"
   - **Execute as**: Me (email của bạn)
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy **Web app URL** (dạng: `https://script.google.com/macros/s/.../exec`)

#### Bước 4: Cấu hình URL
1. Mở file `.env.local`
2. Thay thế URL:
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

## 📊 Cấu trúc dữ liệu trong Google Sheets

Khi có người quay lì xì, dữ liệu sẽ được tự động lưu vào Google Sheet với các cột:

| Timestamp | Instagram | Amount (VND) | Date |
|-----------|-----------|--------------|------|
| 2025-12-03 10:30:00 | @username | 50000 | 03/12/2025 10:30:00 |

## 🎨 Customization

### Thay đổi số tiền lì xì

Mở file `app/page.tsx` và chỉnh sửa mảng `LUCKY_AMOUNTS`:

```typescript
const LUCKY_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 200000, 500000];
```

### Thay đổi màu sắc

Chỉnh sửa classes Tailwind trong file `app/page.tsx`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Google Sheets (via Apps Script)

## 🎯 Deploy lên Vercel

```bash
npm install -g vercel
vercel
```

Nhớ thêm environment variable `GOOGLE_APPS_SCRIPT_URL` trong Vercel dashboard.

## 🐛 Troubleshooting

### Lỗi CORS khi gọi Google Apps Script
- Đảm bảo bạn đã deploy Apps Script với quyền "Anyone"
- Kiểm tra URL trong `.env.local` có chính xác không

### Dữ liệu không lưu vào Google Sheets
- Kiểm tra Console (F12) xem có lỗi gì không
- Vào Apps Script → Execution history để xem logs
- Đảm bảo file `.env.local` đã được tạo và có URL đúng

## 🎉 Chúc mừng năm mới!

Chúc bạn năm mới vui vẻ, nhiều may mắn và thành công! 🍀🧧

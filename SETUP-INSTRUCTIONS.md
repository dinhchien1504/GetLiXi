# 📋 Hướng dẫn Setup Chi Tiết

## ⚠️ QUAN TRỌNG: Update Google Apps Script

Bạn **BẮT BUỘC** phải update lại code trong Google Apps Script để có tính năng kiểm tra duplicate Instagram!

### Bước 1: Mở Google Apps Script

1. Vào Google Sheet của bạn
2. Click **Extensions** → **Apps Script**

### Bước 2: Thay thế toàn bộ code

1. **XÓA TẤT CẢ** code cũ trong Apps Script
2. Copy toàn bộ nội dung file `google-apps-script.js` 
3. Paste vào Apps Script
4. Click **Save** (Ctrl + S)

### Bước 3: Deploy lại (Nếu cần)

Nếu bạn đã deploy rồi thì không cần deploy lại, URL vẫn giữ nguyên!

Nhưng nếu chưa deploy:
1. Click **Deploy** → **New deployment**
2. Chọn type: **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy URL (dạng: `https://script.google.com/macros/s/.../exec`)

### Bước 4: Cấu hình .env.local (ĐÃ XONG)

✅ File `.env.local` đã được cấu hình với URL:
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwnXIWpRrp3XS7uXMiM-6_8UnONj0OvlTTA1huVKMKkYZBmoFu8apDAoy3cFCGNctSo/exec
```

---

## 🚀 Chạy App

```bash
npm run dev
```

Mở: http://localhost:3000

---

## 🎯 Luồng Hoạt Động Mới

### 1. **Client (Frontend)**
- User nhập Instagram
- Click "Quay lì xì"
- Chỉ gửi tên Instagram đến server (KHÔNG gửi số tiền)

### 2. **Server Next.js (API Route)**
- Nhận tên Instagram
- **RANDOM số tiền LÌ XÌ Ở SERVER** với tỉ lệ:
  - 5,000đ: 30% cơ hội
  - 10,000đ: 25% cơ hội
  - 20,000đ: 20% cơ hội
  - 50,000đ: 15% cơ hội
  - 100,000đ: 7% cơ hội
  - 200,000đ: 2% cơ hội
  - 500,000đ: 1% cơ hội
- Gửi Instagram + Amount đến Google Apps Script

### 3. **Google Apps Script**
- Kiểm tra Instagram đã tồn tại trong Sheet chưa
- **Nếu ĐÃ TỒN TẠI:**
  - Trả về `isDuplicate: true`
  - Kèm số tiền đã bốc lần trước
  - Frontend hiển thị: "Bạn đã bốc lì xì rồi!"
- **Nếu CHƯA TỒN TẠI:**
  - Thêm dòng mới vào Sheet
  - Trả về `isDuplicate: false`
  - Frontend hiển thị kết quả + số tiền

---

## 🔒 Bảo Mật

✅ **Client KHÔNG thể hack số tiền** vì:
- Random xử lý 100% ở server
- Client chỉ gửi tên Instagram
- Số tiền không bao giờ đi từ client

✅ **Mỗi Instagram chỉ quay 1 lần** vì:
- Google Sheet kiểm tra duplicate
- So sánh không phân biệt hoa thường
- Tự động loại bỏ khoảng trắng

---

## 🎨 Thay Đổi Tỉ Lệ Lì Xì

Mở file `app/api/save-result/route.ts` và sửa:

```typescript
const LUCKY_CONFIG = [
  { amount: 5000, weight: 30 },    // 30% cơ hội
  { amount: 10000, weight: 25 },   // 25% cơ hội
  { amount: 20000, weight: 20 },   // 20% cơ hội
  { amount: 50000, weight: 15 },   // 15% cơ hội
  { amount: 100000, weight: 7 },   // 7% cơ hội
  { amount: 200000, weight: 2 },   // 2% cơ hội
  { amount: 500000, weight: 1 },   // 1% cơ hội
];
```

**Lưu ý:** Tổng weight không cần phải bằng 100, hệ thống tự tính phần trăm!

---

## 📊 Kiểm Tra Dữ Liệu

Vào Google Sheet, bạn sẽ thấy:

| Timestamp | Instagram | Amount (VND) | Date |
|-----------|-----------|--------------|------|
| ... | testuser | 50000 | 03/12/2025 10:30:00 |

- Instagram được lưu ở dạng **lowercase** để dễ so sánh
- Timestamp là ISO format
- Date là định dạng Việt Nam

---

## 🐛 Debug

### Kiểm tra Apps Script có hoạt động không:

1. Vào Apps Script
2. Chọn function `doPost`
3. Click **Debug** hoặc xem **Execution log**

### Kiểm tra API Next.js:

Mở Console (F12) khi quay lì xì, xem có lỗi không.

### Test thủ công:

```bash
curl -X POST http://localhost:3000/api/save-result \
  -H "Content-Type: application/json" \
  -d '{"instagram":"testuser"}'
```

---

## ✅ Checklist

- [ ] Copy code mới vào Google Apps Script
- [ ] Deploy Apps Script (nếu chưa)
- [ ] File `.env.local` có URL đúng
- [ ] Chạy `npm run dev`
- [ ] Test với Instagram bất kỳ
- [ ] Test lại cùng Instagram → phải báo "đã bốc rồi"

---

Chúc bạn thành công! 🎉🧧

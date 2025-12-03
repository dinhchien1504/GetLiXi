# 📝 Cập Nhật Google Apps Script - Thêm Leaderboard

## Thêm vào file `app.gs`

Trong phần **XỬ LÝ ACTION PUBLIC** (trước kiểm tra token), thêm case `get_leaderboard`:

```javascript
// --------- XỬ LÝ ACTION CRUD Public ---------
try {
  switch (action) {
    case "get":
      return APIResponse(getUsers());
      
    case "login":
      if (!e.postData || !e.postData.contents) throw new Error("Missing data");
      const loginData = JSON.parse(e.postData.contents);
      return APIResponse(login(loginData));
    
    case "lucky_spin":
      if (!e.postData || !e.postData.contents) throw new Error("Missing data");
      const luckyData = JSON.parse(e.postData.contents);
      return APIResponse(handleLuckySpin(luckyData));
    
    // ========== THÊM MỚI: LẤY BẢNG XẾP HẠNG ==========
    case "get_leaderboard":
      return APIResponse(getLeaderboard());
    // ================================================
    
    default:
      result = { success: false, message: "Action not recognized" };
  }
} catch (err) {
  return APIResponse({ success: false, message: err.message });
}
```

## Thêm vào file `lucky.gs`

Thêm function mới vào cuối file `lucky.gs`:

```javascript
// ----------------- GET LEADERBOARD (TOP 10) -----------------
function getLeaderboard() {
  const sheet = getOrCreateLuckySheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    // Chỉ có header hoặc rỗng
    return { success: true, data: [] };
  }
  
  // Bỏ header
  const headers = data.shift();
  
  // Chuyển thành array of objects
  const allEntries = data.map(row => ({
    instagram: row[0],
    amount: row[1],
    timestamp: row[2],
    date: row[3]
  }));
  
  // Sắp xếp theo amount giảm dần, lấy top 10
  const topEntries = allEntries
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
  
  return { 
    success: true, 
    data: topEntries 
  };
}
```

## ✅ Xong!

Sau khi thêm 2 đoạn code trên:
1. **Save** (Ctrl + S)
2. **Không cần deploy lại**
3. Test ngay!

---

## 🎯 Tính năng mới:

- ✅ **Enter để quay**: Nhấn Enter trong ô input sẽ quay lì xì
- ✅ **Tự xóa lỗi**: Khi nhập vào ô input, lỗi sẽ tự động ẩn
- ✅ **Bảng xếp hạng**: Top 10 người may mắn nhất
  - 🥇 Hạng 1: Viền vàng
  - 🥈 Hạng 2: Viền bạc
  - 🥉 Hạng 3: Viền đồng
  - Button làm mới để cập nhật real-time

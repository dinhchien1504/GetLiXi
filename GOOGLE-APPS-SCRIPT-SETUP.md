# 📝 Hướng Dẫn Setup Google Apps Script

## 🎯 Bước 1: Cập nhật file `app.gs`

Thêm case `lucky_spin` vào phần xử lý action **TRƯỚC PHẦN KIỂM TRA TOKEN**:

```javascript
// ----------------- HANDLE REQUEST -----------------
function handleRequest(e) {
  const action = e.parameter.action;

  // --------- XỬ LÝ ACTION CRUD Public ---------
  try {
    switch (action) {
      case "get":
        return APIResponse(getUsers());
      case "login":
        if (!e.postData || !e.postData.contents) throw new Error("Missing data");
        const loginData = JSON.parse(e.postData.contents);
        return APIResponse(login(loginData));
      
      // ========== THÊM MỚI: XỬ LÝ LÌ XÌ ==========
      case "lucky_spin":
        if (!e.postData || !e.postData.contents) throw new Error("Missing data");
        const luckyData = JSON.parse(e.postData.contents);
        return APIResponse(handleLuckySpin(luckyData));
      // ==========================================
      
      default:
        result = { success: false, message: "Action not recognized" };
    }
  } catch (err) {
    return APIResponse({ success: false, message: err.message });
  }

  // --------- KIEM TRA TOKEN --------- (phần này giữ nguyên)
  // ...rest of code
}
```

## 🎯 Bước 2: Tạo file mới `lucky.gs`

Trong Google Apps Script, click **+** bên cạnh **Files** → chọn **Script** → đặt tên `lucky` → paste code sau:

```javascript
const LUCKY_SHEET_NAME = "LuckyMoney"; // Tên sheet lưu lì xì

// ----------------- HANDLE LUCKY SPIN -----------------
function handleLuckySpin(data) {
  const { instagram, amount, timestamp } = data;
  
  // Validate
  if (!instagram || !amount) {
    return { success: false, message: "Missing required fields" };
  }
  
  const sheet = getOrCreateLuckySheet();
  const existingUser = checkInstagramExists(sheet, instagram);
  
  // Nếu Instagram đã tồn tại
  if (existingUser) {
    return {
      success: false,
      isDuplicate: true,
      message: \`Instagram @\${instagram} đã bốc lì xì rồi!\`,
      previousAmount: existingUser.amount,
      previousDate: existingUser.date
    };
  }
  
  // Thêm user mới vào sheet
  const rowData = [
    instagram,
    amount,
    timestamp || new Date().toISOString(),
    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  ];
  
  sheet.appendRow(rowData);
  
  return {
    success: true,
    isDuplicate: false,
    message: "Chúc mừng bạn đã nhận được lì xì!",
    instagram: instagram,
    amount: amount
  };
}

// ----------------- CHECK INSTAGRAM EXISTS -----------------
function checkInstagramExists(sheet, instagram) {
  const data = sheet.getDataRange().getValues();
  const cleanInstagram = instagram.toLowerCase().trim();
  
  // Bỏ qua header (row 0)
  for (let i = 1; i < data.length; i++) {
    const existingInstagram = String(data[i][0]).toLowerCase().trim();
    
    if (existingInstagram === cleanInstagram) {
      return {
        amount: data[i][1],
        date: data[i][3] || data[i][2]
      };
    }
  }
  
  return null;
}

// ----------------- GET OR CREATE SHEET -----------------
function getOrCreateLuckySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LUCKY_SHEET_NAME);
  
  // Tạo sheet mới nếu chưa có
  if (!sheet) {
    sheet = ss.insertSheet(LUCKY_SHEET_NAME);
    
    // Tạo header
    const headers = ["Instagram", "Amount", "Timestamp", "Date (VN)"];
    sheet.appendRow(headers);
    
    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("#ffffff");
    
    // Auto resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

// ----------------- GET ALL LUCKY SPINS (Optional - để xem danh sách) -----------------
function getAllLuckySpins() {
  const sheet = getOrCreateLuckySheet();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const spins = data.map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
  
  return { success: true, data: spins };
}
```

## 🎯 Bước 3: Deploy (Nếu chưa deploy)

1. Click **Deploy** → **New deployment**
2. Click ⚙️ → chọn **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy URL

## 🎯 Bước 4: Test

Sau khi save và deploy, test bằng cách:

1. Chạy `npm run dev` trong thư mục lucky-money
2. Mở http://localhost:3000
3. Nhập Instagram và quay
4. Kiểm tra Google Sheet → sẽ tự động tạo sheet **LuckyMoney**

## ✅ Kết quả

Sheet **LuckyMoney** sẽ có cấu trúc:

| Instagram | Amount | Timestamp | Date (VN) |
|-----------|--------|-----------|-----------|
| testuser | 50000 | 2025-12-03T10:30:00.000Z | 03/12/2025 10:30:00 |

## 🔍 Debug

Nếu có lỗi, vào Apps Script → **Executions** để xem log.

URL API của bạn:
```
https://script.google.com/macros/s/AKfycbw8w-4eqz2JSHXSDGgD3ys104QhYpATsiTVNDajYSqGlEFPuHCNsBoD78xpdRIFovy_/exec
```

Đã được cấu hình trong `.env.local` ✅

---

Xong! Giờ bạn có thể test. 🎉🧧

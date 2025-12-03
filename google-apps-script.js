/**
 * Google Apps Script để nhận dữ liệu từ Next.js và lưu vào Google Sheet
 * CÓ KIỂM TRA DUPLICATE INSTAGRAM
 * 
 * Hướng dẫn setup:
 * 1. Tạo Google Sheet mới
 * 2. Vào Extensions > Apps Script
 * 3. Copy code này vào
 * 4. Deploy > New deployment > Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Copy URL và paste vào .env.local
 */

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get active spreadsheet (or specify by ID)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If this is the first time, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Instagram', 'Amount (VND)', 'Date']);
    }
    
    // Prepare data
    const timestamp = new Date(data.timestamp);
    const instagram = data.instagram.toLowerCase().trim(); // Normalize để so sánh
    const amount = data.amount;
    const dateFormatted = Utilities.formatDate(timestamp, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    
    // **KIỂM TRA INSTAGRAM ĐÃ TỒN TẠI CHƯA**
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) { // Có dữ liệu (không chỉ header)
      const instagramColumn = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Cột B (Instagram)
      
      for (let i = 0; i < instagramColumn.length; i++) {
        const existingInstagram = String(instagramColumn[i][0]).toLowerCase().trim();
        
        if (existingInstagram === instagram) {
          // TÌM THẤY DUPLICATE!
          const existingRow = i + 2; // +2 vì bắt đầu từ row 2 và index từ 0
          const existingAmount = sheet.getRange(existingRow, 3).getValue();
          const existingDate = sheet.getRange(existingRow, 4).getValue();
          
          return ContentService
            .createTextOutput(JSON.stringify({
              success: false,
              isDuplicate: true,
              message: 'Instagram đã tồn tại',
              previousAmount: existingAmount,
              previousDate: existingDate
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // CHƯA TỒN TẠI -> Thêm mới
    sheet.appendRow([
      timestamp,
      instagram,
      amount,
      dateFormatted
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        isDuplicate: false,
        message: 'Data saved successfully',
        row: sheet.getLastRow(),
        instagram: instagram,
        amount: amount
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        instagram: '@test_user',
        amount: 50000,
        timestamp: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}

'use server';

import { NextRequest, NextResponse } from 'next/server';

// Cấu hình tỉ lệ và số tiền lì xì
const LUCKY_CONFIG = [
  { amount: 20000, weight: 15 },    // 15% cơ hội
  { amount: 40000, weight: 15 },    // 15% cơ hội
  { amount: 50000, weight: 25 },   // 25% cơ hội
  { amount: 100000, weight: 10 },   // 10% cơ hội
  { amount: 150000, weight: 10 },   // 10% cơ hội
  { amount: 200000, weight: 15 },   // 15% cơ hội
  { amount: 300000, weight: 7 },   // 7% cơ hội
  { amount: 400000, weight: 2 },   // 2% cơ hội
  { amount: 500000, weight: 1 },   // 1% cơ hội
];

// Hàm random có trọng số
function weightedRandom(): number {
  const totalWeight = LUCKY_CONFIG.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of LUCKY_CONFIG) {
    if (random < item.weight) {
      return item.amount;
    }
    random -= item.weight;
  }
  
  return LUCKY_CONFIG[0].amount; // fallback
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instagram } = body;

    // Validate input
    if (!instagram || !instagram.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên Instagram' },
        { status: 400 }
      );
    }

    // Clean instagram name
    const cleanInstagram = instagram.trim().replace(/^@/, '');

    // Google Apps Script Web App URL
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

    if (!APPS_SCRIPT_URL) {
      console.error('GOOGLE_APPS_SCRIPT_URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Random số tiền lì xì ở SERVER (không cho phép client can thiệp)
    const luckyAmount = weightedRandom();
    const timestamp = new Date().toISOString();

    // Tạo URL với action=lucky_spin
    const urlWithParams = `${APPS_SCRIPT_URL}?action=lucky_spin`;

    // Gửi dữ liệu đến Google Apps Script
    const response = await fetch(urlWithParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "lucky_spin",
        instagram: cleanInstagram,
        amount: luckyAmount,
        timestamp,
      }),
      redirect: 'follow'
    });

    // console.log('Apps Script response status:',  await response.json());

    if (!response.ok) {
      console.error('Apps Script response not OK:', response.status);
      throw new Error('Failed to save to Google Sheets');
    }

    const result = await response.json();

    // Kiểm tra response từ Apps Script
    if (!result.success) {
      // Nếu là duplicate
      if (result.isDuplicate) {
        return NextResponse.json({ 
          success: false,
          isDuplicate: true,
          message: result.message || `Instagram @${cleanInstagram} đã bốc lì xì rồi!`,
          previousAmount: result.previousAmount,
          previousDate: result.previousDate
        });
      }
      
      // Lỗi khác
      return NextResponse.json(
        { error: result || 'Đã có lỗi xảy ra' },
        { status: 500 }
      );
    }

    // Trả về kết quả thành công
    return NextResponse.json({ 
      success: true,
      isDuplicate: false,
      instagram: cleanInstagram,
      amount: luckyAmount,
      message: result.message || 'Chúc mừng bạn đã nhận được lì xì!'
    });

  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
}

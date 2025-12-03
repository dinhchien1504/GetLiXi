import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Google Apps Script Web App URL
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

    if (!APPS_SCRIPT_URL) {
      console.error('GOOGLE_APPS_SCRIPT_URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Gọi API lấy leaderboard
    const urlWithParams = `${APPS_SCRIPT_URL}?action=get_leaderboard`;

    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to get leaderboard' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

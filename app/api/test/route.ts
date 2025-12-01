// app/api/test/route.ts
import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB Connected Successfully!',
      database: 'coursemaster',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ MongoDB Connection Failed',
      error: error.message,
    }, { status: 500 });
  }
}
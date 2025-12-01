// app/api/auth/logout/route.ts
import { removeAuthCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await removeAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// app/api/auth/verify-db/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    
    // Get all users from database
    const users = await User.find({})
      .select('-password -googleId -__v')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get stats
    const totalUsers = await User.countDocuments();
    const localUsers = await User.countDocuments({ provider: 'local' });
    const googleUsers = await User.countDocuments({ provider: 'google' });
    
    return NextResponse.json({
      success: true,
      database: 'coursemaster',
      stats: {
        totalUsers,
        localUsers,
        googleUsers,
      },
      recentUsers: users,
      message: '✅ Database users fetched successfully',
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
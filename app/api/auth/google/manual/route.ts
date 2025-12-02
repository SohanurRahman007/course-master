// app/api/auth/google/manual/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, googleId, avatar } = await request.json();
    
    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });
    
    if (!user) {
      // Create new Google user
      user = new User({
        name,
        email,
        googleId,
        provider: 'google',
        emailVerified: true,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        role: 'student',
      });
      
      await user.save();
    }
    
    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    // Set cookie
    await setAuthCookie(token);
    
    return NextResponse.json({
      success: true,
      message: 'Google user created/authenticated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
      },
      token,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
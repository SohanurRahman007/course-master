// app/api/auth/login/route.ts - SIMPLE VERSION (যদি NextAuth না চান)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'No account found with this email' 
        },
        { status: 401 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'INVALID_PASSWORD',
          message: 'Incorrect password' 
        },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'SERVER_ERROR',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
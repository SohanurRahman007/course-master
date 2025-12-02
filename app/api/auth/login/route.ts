// app/api/auth/login/route.ts - UPDATED
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    // Find user in database
    const user = await User.findOne({ 
      email: validatedData.email.toLowerCase(),
      provider: 'local' // Only local users can login with password
    }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'No account found with this email. Please register first.'
        },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Incorrect password. Please try again.'
        },
        { status: 401 }
      );
    }
    
    // Update last login (optional)
    user.updatedAt = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    // Set cookie
    await setAuthCookie(token);
    
    // Prepare response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
      enrolledCourses: user.enrolledCourses.length,
      createdAt: user.createdAt,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Login successful! Welcome back.',
      user: userResponse,
      token,
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
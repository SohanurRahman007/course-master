// app/api/auth/register/route.ts - UPDATED (Manual password hash)
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs'; // Import bcrypt

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'instructor']).default('student'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: validatedData.email.toLowerCase() 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'User already exists',
          message: 'An account with this email already exists.'
        },
        { status: 400 }
      );
    }
    
    // ✅ MANUAL PASSWORD HASHING (since pre-save hook is problematic)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    // Create new user with hashed password
    const user = new User({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword, // Already hashed
      role: validatedData.role,
      provider: 'local',
      emailVerified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(validatedData.name)}&background=random`,
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    // Set HTTP-only cookie
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
      createdAt: user.createdAt,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: userResponse,
      token,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
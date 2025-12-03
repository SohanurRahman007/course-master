// app/api/auth/register/route.ts - WORKING VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Register API called');
    
    // Connect to database
    const connection = await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📦 Request body:', { ...body, password: '***' });
    
    const { name, email, password, role = 'student' } = body;

    // Basic validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { 
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Name, email and password are required' 
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return NextResponse.json(
        { 
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { 
          success: false,
          error: 'USER_EXISTS',
          message: 'User already exists with this email' 
        },
        { status: 409 }
      );
    }

    console.log('🔐 Hashing password...');
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('👤 Creating user...');
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      emailVerified: false,
    });

    console.log('✅ User created:', user.email);
    
    // Prepare response
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userResponse,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Handle specific errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'DUPLICATE_KEY',
          message: 'Email already exists' 
        },
        { status: 409 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false,
          error: 'VALIDATION_ERROR',
          message: errors.join(', ') 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'SERVER_ERROR',
        message: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}
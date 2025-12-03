// app/api/seed/admin/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@coursemaster.com' });
    
    if (adminExists) {
      return NextResponse.json({
        success: true,
        message: '✅ Admin user already exists',
        admin: {
          email: adminExists.email,
          role: adminExists.role,
        }
      });
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'CourseMaster Admin',
      email: 'admin@coursemaster.com',
      password: 'Admin@123',
      role: 'admin',
    });
    
    await adminUser.save();
    
    return NextResponse.json({
      success: true,
      message: '✅ Admin user created successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
      credentials: {
        email: 'admin@coursemaster.com',
        password: 'Admin@123',
        note: 'Change this password after first login!'
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Failed to create admin user',
      error: error.message,
    }, { status: 500 });
  }
}
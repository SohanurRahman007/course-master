// app/api/seed/courses/route.ts
import { connectDB } from '@/lib/db';
import { Course } from '@/app/models/Course';
import { NextResponse } from 'next/server';

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and build real projects',
    instructor: 'John Smith',
    price: 2999,
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
    rating: 4.8,
    studentsEnrolled: 12500,
    lessons: [
      { title: 'Introduction to Web Development', videoUrl: 'https://youtu.be/sample1', duration: '30 min' },
      { title: 'HTML Fundamentals', videoUrl: 'https://youtu.be/sample2', duration: '45 min' },
    ]
  },
  {
    title: 'Data Science & Machine Learning',
    description: 'Master Python, Pandas, NumPy, Scikit-learn, TensorFlow for Data Science',
    instructor: 'Sarah Johnson',
    price: 3999,
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
    rating: 4.9,
    studentsEnrolled: 8500,
    lessons: [
      { title: 'Python for Data Science', videoUrl: 'https://youtu.be/sample3', duration: '40 min' },
      { title: 'Data Analysis with Pandas', videoUrl: 'https://youtu.be/sample4', duration: '55 min' },
    ]
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing sample courses (optional)
    await Course.deleteMany({ instructor: { $in: ['John Smith', 'Sarah Johnson'] } });
    
    // Insert sample courses
    const createdCourses = await Course.insertMany(sampleCourses);
    
    return NextResponse.json({
      success: true,
      message: `✅ ${createdCourses.length} sample courses created`,
      courses: createdCourses.map(course => ({
        id: course._id,
        title: course.title,
        price: course.price,
        category: course.category,
      }))
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Failed to create sample courses',
      error: error.message,
    }, { status: 500 });
  }
}
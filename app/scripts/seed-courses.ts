// scripts/seed-courses.ts
import { connectDB } from '@/lib/db';
import { Course } from '../models/Course';
import { User } from '../models/User';
// import { Course } from '@/models/Course';
// import { User } from '@/models/User';

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and build real projects.',
    price: 49.99,
    category: 'web-development',
    tags: ['javascript', 'react', 'nodejs', 'mongodb'],
    duration: 65,
    level: 'beginner',
    enrolledStudents: 1250,
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
  },
  {
    title: 'Data Science & Machine Learning',
    description: 'Master Python, Pandas, NumPy, Scikit-learn, TensorFlow for data analysis and ML.',
    price: 59.99,
    category: 'data-science',
    tags: ['python', 'machine-learning', 'data-analysis', 'tensorflow'],
    duration: 80,
    level: 'intermediate',
    enrolledStudents: 890,
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w-800&auto=format&fit=crop',
  },
  // Add more courses...
];

async function seedCourses() {
  try {
    await connectDB();
    
    // Find an instructor
    const instructor = await User.findOne({ role: 'instructor' });
    
    if (!instructor) {
      console.log('No instructor found. Creating one...');
      return;
    }
    
    // Add instructor info to courses
    const coursesWithInstructor = courses.map(Course => ({
      ...course,
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        avatar: instructor.avatar,
      },
      syllabus: Array.from({ length: 10 }, (_, i) => ({
        week: i + 1,
        title: `Week ${i + 1}: Introduction`,
        description: `Learning materials for week ${i + 1}`,
        duration: 60,
      })),
    }));
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert new courses
    await Course.insertMany(coursesWithInstructor);
    
    console.log('✅ Courses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
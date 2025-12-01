// lib/models/Course.ts
import mongoose from 'mongoose';

interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  thumbnail?: string;
  rating: number;
  studentsEnrolled: number;
  lessons: {
    title: string;
    videoUrl: string;
    duration: string;
    isCompleted?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
  },
  thumbnail: {
    type: String,
    default: '/course-placeholder.jpg',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  lessons: [{
    title: String,
    videoUrl: String,
    duration: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

// Create text index for search
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
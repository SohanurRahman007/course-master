// models/Course.ts
import mongoose from 'mongoose';

// Syllabus Schema
const syllabusSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: String,
  duration: Number, // in minutes
});

// Main Course Schema
const courseSchema = new mongoose.Schema(
  {
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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: '',
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'web-development',
        'data-science',
        'mobile-development',
        'design',
        'business',
        'marketing',
        'other',
      ],
    },
    tags: [
      {
        type: String,
      },
    ],
    syllabus: [syllabusSchema],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: '/default-course.jpg',
    },
    duration: {
      type: Number, // in hours
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledStudents: -1 });
courseSchema.index({ createdAt: -1 });

// Virtual for formatted price
courseSchema.virtual('formattedPrice').get(function () {
  if (this.price === 0) return 'Free';
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function () {
  if (this.duration < 1) return `${Math.round(this.duration * 60)} min`;
  if (this.duration === 1) return '1 hour';
  return `${this.duration} hours`;
});

// Ensure virtuals are included in JSON output
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// TypeScript interface
export interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  instructor: {
    _id: mongoose.Types.ObjectId;
    name: string;
    avatar: string;
  };
  price: number;
  category: string;
  tags: string[];
  syllabus: Array<{
    week: number;
    title: string;
    description: string;
    videoUrl?: string;
    duration?: number;
  }>;
  rating: number;
  enrolledStudents: number;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPublished: boolean;
  formattedPrice: string;
  formattedDuration: string;
  createdAt: Date;
  updatedAt: Date;
}
// lib/models/User.ts - SIMPLE WORKING VERSION
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  avatar: string;
  emailVerified: boolean;
  enrolledCourses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: '',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: [],
  }],
}, {
  timestamps: true,
});


// Compare password method
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
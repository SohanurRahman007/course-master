// lib/models/User.ts - SIMPLE FIX (Remove problematic pre-save hook)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'student' | 'instructor' | 'admin';
  avatar: string;
  emailVerified: boolean;
  provider: 'local' | 'google';
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
    minlength: [6, 'Password must be at least 6 characters'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
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
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: [],
  }],
}, {
  timestamps: true,
});


// ✅ Simple compare password method
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  const user = this as any;
  
  if (!user.password) {
    return false;
  }
  
  return await bcrypt.compare(candidatePassword, user.password);
};

// Hide sensitive data
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.googleId;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
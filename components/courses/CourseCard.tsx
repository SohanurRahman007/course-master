// components/courses/CourseCard.tsx
"use client";

import { Star, Users, Clock, Award } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    instructor: {
      name: string;
      avatar: string;
    };
    price: number;
    category: string;
    rating: number;
    enrolledStudents: number;
    thumbnail: string;
    duration: number;
    level?: "beginner" | "intermediate" | "advanced";
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  // Format duration
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };

  // Get level color
  const getLevelColor = (level?: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <img
          src={course.thumbnail || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-course.jpg";
          }}
        />

        {/* Level Badge */}
        {course.level && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
              course.level
            )}`}
          >
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-1 rounded-lg font-bold shadow-lg">
          {formatPrice(course.price)}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-2">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {course.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <Link
            href={`/courses/${course._id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {course.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden mr-3">
            {course.instructor.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                {course.instructor.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {course.instructor.name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          {/* Rating */}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="font-semibold">{course.rating.toFixed(1)}</span>
          </div>

          {/* Students */}
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span>{course.enrolledStudents.toLocaleString()}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span>{formatDuration(course.duration)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/courses/${course._id}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// components/courses/CourseGrid.tsx
// import CourseCard from "./CourseCard";
// import Pagination from "@/components/ui/Pagination";

import Pagination from "../ui/pagination";
import CourseCard from "./CourseCard";

interface Course {
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
}

interface CourseGridProps {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  totalCourses: number;
}

export default function CourseGrid({
  courses,
  currentPage,
  totalPages,
  totalCourses,
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No courses found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCourses}
        />
      )}
    </div>
  );
}

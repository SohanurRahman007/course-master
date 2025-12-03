// app/page.tsx - CourseMaster Home Page
import { Suspense } from "react";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseSearch from "@/components/courses/CourseSearch";
import HeroSection from "@/components/home/HeroSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getCourses } from "@/lib/actions/course.actions";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract search parameters
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const category =
    typeof searchParams.category === "string" ? searchParams.category : "";
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit = 9; // 3x3 grid

  // Fetch courses with server-side filtering
  const coursesData = await getCourses({
    search,
    category,
    sort,
    page,
    limit,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Discover Your Next Skill
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {coursesData.total} courses available to boost your career
              </p>
            </div>

            <CourseSearch initialSearch={search} />
          </div>

          {/* Filters */}
          <CourseFilters
            currentCategory={category}
            currentSort={sort}
            totalCourses={coursesData.total}
          />
        </div>

        {/* Course Grid with Suspense */}
        <Suspense fallback={<LoadingSpinner />}>
          <CourseGrid
            courses={coursesData.courses}
            currentPage={page}
            totalPages={coursesData.totalPages}
            totalCourses={coursesData.total}
          />
        </Suspense>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why Choose CourseMaster?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Quality Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Courses created by industry experts with practical, real-world
                projects.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Learn at Your Pace
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lifetime access to course materials with flexible learning
                schedules.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Get Certified
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn recognized certificates to showcase your skills to
                employers.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with
              CourseMaster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse All Courses
              </Link>
              <a
                href="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Join for Free
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

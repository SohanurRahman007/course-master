import Link from "next/link";

// components/home/HeroSection.tsx
export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Learn Without Limits
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Advance your career with industry-relevant courses from world-class
            instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/courses"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Start Learning Free
            </Link>
            <a
              href="#courses"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

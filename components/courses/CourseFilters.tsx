// components/courses/CourseFilters.tsx
"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

export default function CourseFilters({
  currentCategory = "",
  currentSort = "newest",
  totalCourses,
}: {
  currentCategory?: string;
  currentSort?: string;
  totalCourses: number;
}) {
  const router = useRouter();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (e.target.value) params.set("category", e.target.value);
    if (currentSort !== "newest") params.set("sort", currentSort);

    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (e.target.value !== "newest") params.set("sort", e.target.value);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Showing <span className="font-semibold">{totalCourses}</span> courses
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={handleSortChange}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// components/courses/CourseSearch.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

export default function CourseSearch({
  initialSearch = "",
}: {
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    router.push(`/?${params.toString()}`);
  }, [search, router]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full md:w-auto">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search courses by title or instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Search size={20} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </div>
  );
}

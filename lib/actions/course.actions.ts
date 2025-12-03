// lib/actions/course.actions.ts

import { Course } from "@/app/models/Course";

export async function getCourses({
  search = '',
  category = '',
  sort = 'newest',
  page = 1,
  limit = 9,
}: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const query: any = {};
    const skip = (page - 1) * limit;

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'instructor.name': { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { enrolledStudents: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get total count
    const total = await Course.countDocuments(query);

    // Get paginated courses
    const courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      courses: JSON.parse(JSON.stringify(courses)),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      courses: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}
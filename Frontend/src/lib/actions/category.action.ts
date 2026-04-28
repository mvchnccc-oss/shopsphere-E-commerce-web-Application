"use server";
import { Categories, Category, PaginatedCategories } from "@/lib/interfaces/categories.interface";
import fetchApi from "../fetchApi";

const EMPTY_CATEGORIES_PAGE: PaginatedCategories = {
  categories: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 3,
};

export async function getAllCategories(): Promise<Categories | null> {
  const result = await fetchApi("categories", "GET", { includeToken: false });

  if (result.status === "Success") {
    return result.data.categories;
  }

  return null;
}

export async function getPaginatedCategories(
  page: number = 0,
  size: number = 3
): Promise<PaginatedCategories> {
  const result = await fetchApi(`categories?page=${page}&size=${size}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    const data = result.data;
    return {
      categories: data.categories ?? [],
      currentPage: data.currentPage ?? 0,
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
      pageSize: data.pageSize ?? size,
    };
  }

  return { ...EMPTY_CATEGORIES_PAGE, pageSize: size };
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await fetchApi(`categories/${id}`, "GET", { includeToken: false });

  if (result.status === "Success") {
    return result.data.category;
  }

  return null;
}

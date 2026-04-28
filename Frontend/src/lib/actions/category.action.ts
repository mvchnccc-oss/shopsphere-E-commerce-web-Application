"use server";
import { Categories, Category } from "@/lib/interfaces/categories.interface";
import fetchApi from "../fetchApi";

export async function getAllCategories(): Promise<Categories | null> {
  const result = await fetchApi("categories", "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data.categories;
  }

  return null;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await fetchApi(`categories/${id}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data.category;
  }

  return null;
}

"use server";
import fetchApi from "../fetchApi";

export async function getAllCategories() {
  const result = await fetchApi("categories", "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data.categories;
  }

  return null;
}

export async function getCategoryById(id: number) {
  const result = await fetchApi(`categories/${id}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data.category;
  }

  return null;
}

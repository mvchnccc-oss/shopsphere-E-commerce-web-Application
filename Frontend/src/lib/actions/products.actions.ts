"use server";
import fetchApi from "../fetchApi";
import type { Products } from "@/lib/interfaces/products.interface";

export async function getAllProducts(): Promise<Products> {
  const result = await fetchApi("products", "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data ?? [];
  }

  return [];
}

export async function getProductById(id: number) {
  const result = await fetchApi(`products/${id}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data;
  }

  return null;
}

export async function getProductsByCategory(categoryId: number): Promise<Products> {
  const result = await fetchApi("products", "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    const data: Products = result.data;
    return data.filter((p) => p.category?.id === categoryId) ?? [];
  }

  return [];
}
"use server";
import type { Product, Products } from "@/lib/interfaces/products.interface";
import fetchApi from "../fetchApi";

export async function getAllProducts(): Promise<Product[]> {
  const result = await fetchApi("products", "GET", {
    includeToken: false,
  });
  if (result.status === "Success") {
    return result.data.products ?? [];
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

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const result = await fetchApi("products", "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    const data: Products = result.data;
    return data.products.filter((p) => p.category?.id === categoryId) ?? [];
  }

  return [];
}

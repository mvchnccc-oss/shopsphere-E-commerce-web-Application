"use server";
import type { PaginatedProducts, Product } from "@/lib/interfaces/products.interface";
import fetchApi from "../fetchApi";

const EMPTY_PAGE: PaginatedProducts = {
  products: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
};

export async function getAllProducts(
  page: number = 0,
  size: number = 10
): Promise<PaginatedProducts> {
  const result = await fetchApi(`products?page=${page}&size=${size}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    const data = result.data;
    return {
      products: data.products ?? [],
      currentPage: data.currentPage ?? 0,
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
      pageSize: data.pageSize ?? size,
    };
  }

  return { ...EMPTY_PAGE, pageSize: size };
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await fetchApi(`products/${id}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    return result.data.product;
  }

  return null;
}

export async function getProductsByCategory(
  categoryId: number,
  page: number = 0,
  size: number = 10
): Promise<PaginatedProducts> {
  const result = await fetchApi(
    `products?categoryId=${categoryId}&page=${page}&size=${size}`,
    "GET",
    { includeToken: false }
  );

  if (result.status === "Success") {
    const data = result.data;
    return {
      products: data.products ?? [],
      currentPage: data.currentPage ?? 0,
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
      pageSize: data.pageSize ?? size,
    };
  }

  return { ...EMPTY_PAGE, pageSize: size };
}

export async function searchProducts(
  search: string,
  page: number = 0,
  size: number = 10,
  categoryId?: number
): Promise<PaginatedProducts> {
  const params = new URLSearchParams({
    search,
    page: String(page),
    size: String(size),
  });

  if (categoryId !== undefined) {
    params.set("categoryId", String(categoryId));
  }

  const result = await fetchApi(`products?${params.toString()}`, "GET", {
    includeToken: false,
  });

  if (result.status === "Success") {
    const data = result.data;
    return {
      products: data.products ?? [],
      currentPage: data.currentPage ?? 0,
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
      pageSize: data.pageSize ?? size,
    };
  }

  return { ...EMPTY_PAGE, pageSize: size };
}
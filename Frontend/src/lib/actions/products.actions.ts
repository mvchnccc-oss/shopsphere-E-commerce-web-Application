"use server";
import type { Products } from "@/lib/interfaces/products.interface";

export async function getAllProducts(): Promise<Products> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data ?? [];
  } catch (error) {
    console.error("[getAllProducts]", error);
    return [];
  }
}

export async function getProductById(id:number) {
 try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
   console.log(error);
  }
}

export async function getProductsByCategory(categoryId: number): Promise<Products> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);
    const data: Products = await response.json();
    return data.filter((p) => p.category?.id === categoryId) ?? [];
  } catch (error) {
    console.error("[getProductsByCategory]", error);
    return [];
  }
}
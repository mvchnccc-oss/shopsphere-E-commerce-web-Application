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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?category=${categoryId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${response.status}`);
    }

    const data = await response.json();
    return data ?? [];
  } catch (error) {
    console.error("[getProductsByCategory]", error);
    return [];
  }
}
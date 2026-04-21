'use server';

import type { Products } from '@/Interfaces/productsinterface';

export async function getAllProducts(): Promise<Products> {
  try {
    const response = await fetch('http://localhost:8080/api/v1/products');

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data ?? [];
  } catch (error) {
    console.error('[getAllProducts]', error);
    return [];
  }
}

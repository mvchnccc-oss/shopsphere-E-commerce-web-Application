"use server";
import fetchApi from "../fetchApi";
import { 
  SellerProduct, 
  CreateProductPayload, 
  SellerActionResult, 
  SellerOrder
} from "../interfaces/seller.interface";


export async function getSellerProductsAction(): Promise<SellerActionResult<SellerProduct[]>> {
  const result = await fetchApi("seller/products", "GET", { includeToken: true });
  
  if (result.status !== "Success") {
    return { success: false, message: "Failed to load products" };
  }
  
  const products: any[] = result.data.products ?? [];
  return {
    success: true,
    data: products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      images: p.images ?? [],
    })),
  };
}


export async function getSellerOrdersAction(): Promise<SellerActionResult<SellerOrder[]>> {
  const result = await fetchApi("seller/orders", "GET", { includeToken: true });

  if (result.status !== "Success") {
    return { success: false, message: "Failed to load orders" };
  }

  return { success: true, data: result.data.orders ?? [] };
}

export async function createProductAction(payload: CreateProductPayload): Promise<SellerActionResult> {
  const result = await fetchApi("products", "POST", { includeToken: true, body: payload });
  return result.status === "Success" ? { success: true, data: null } : { success: false, message: "Failed" };
}

export async function updateProductAction(id: number, payload: CreateProductPayload): Promise<SellerActionResult> {
  const result = await fetchApi(`products/${id}`, "POST", { includeToken: true, body: payload });
  return result.status === "Success" ? { success: true, data: null } : { success: false, message: "Failed" };
}

export async function deleteProductAction(id: number): Promise<SellerActionResult> {
  const result = await fetchApi(`products/${id}`, "DELETE", { includeToken: true });
  return result.status === "Success" ? { success: true, data: null } : { success: false, message: "Failed" };
}

export interface SellerProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export type SellerActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; message: string };

export interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
}

export interface SellerOrder {
  id: number;
  orderedAt: string;
  orderItems: OrderItem[];
  address: OrderAddress;
}
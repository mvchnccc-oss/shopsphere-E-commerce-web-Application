import { CheckoutFormData } from "@/app/(pages)/checkout/page";

export interface Orders {
  orders: Order[];
}

export interface Order {
  id: number;
  orderItems: OrderItem[];
  orderedAt: string;
  address: CheckoutFormData;
}
export interface OrderItem {
  productTitle: string | null;
  productId: number;
  quantity: number;
  pricePerUnit: number;
  product?: {
    id?: number;
    title: string | null;
    images?: string[];
  } | null;
}

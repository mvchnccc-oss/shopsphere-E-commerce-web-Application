import { CheckoutFormData } from "@/app/(pages)/checkout/page";

export interface Orders {
  orders: Order[];
}

export interface Order {
  id: number;
  items: OrderItem[];
  orderedAt: string;
  orderAddress: CheckoutFormData;
}
export interface OrderItem {
  productTitle: string;
  productId: number;
  quantity: number;
  pricePerUnit: number;
}

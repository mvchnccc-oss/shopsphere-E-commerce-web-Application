export interface Orders {
  orders: Order[];
}

export interface Order {
  id: number;
  items: OrderItem[];
}
export interface OrderItem {
  productTitle: string;
  productId: number;
  quantity: number;
  pricePerUnit: number;
}

export type Orders = Order[];

export interface Order {
    id: number;
    items: OrderItem[];
}
export interface OrderItem {
    productId: number;
    quantity: number;
    pricePerUnit: number;
}

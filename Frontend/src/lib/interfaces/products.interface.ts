export type Products = Product[];

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  brand?: {
    name: string;
  };
}

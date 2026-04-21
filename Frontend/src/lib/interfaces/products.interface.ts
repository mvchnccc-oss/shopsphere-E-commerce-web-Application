export type Products = Product[];

export interface Product {
  _id: string;
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

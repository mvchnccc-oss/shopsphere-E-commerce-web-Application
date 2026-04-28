export type Products = {
  products: Product[];
};

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
    id: number;
    image?: string;
  };
  brand?: {
    name: string;
  };
}

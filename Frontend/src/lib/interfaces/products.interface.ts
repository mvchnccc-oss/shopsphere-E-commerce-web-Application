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

export interface PaginatedProducts {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

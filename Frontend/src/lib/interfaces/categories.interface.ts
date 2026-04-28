export interface Category {
  id: number;
  name: string;
  image: string;
  totalProducts: number;
}

export type Categories = Category[];

export interface PaginatedCategories {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

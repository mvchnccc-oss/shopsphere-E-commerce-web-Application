export interface CartProduct {
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface GetCartResponse {
  items: {
    product: {
      id: number;
      title: string;
      price: number;
      category: {
        id: number;
        name: string;
        image: string;
      };
      description: string;
      images: string[];
    };
    quantity: number;
  }[];
}

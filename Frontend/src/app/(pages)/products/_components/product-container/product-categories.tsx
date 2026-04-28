import { Product } from "@/lib/interfaces/products.interface";
import ProductCategory from "./product-category";

interface ProductCategoriesProps {
  products: Product[];
}

type GroupedProducts = { id: number; name: string; products: Product[] };

export default function ProductCategories({ products }: ProductCategoriesProps) {
  const groupedProducts = products.reduce(
    (acc: Record<string, any>, prod) => {
      const category = prod.category;

      if (!acc[category.id]) {
        acc[category.id] = {
          id: category.id,
          name: category.name,
          products: [],
        };
      }

      acc[category.id].products.push(prod);

      return acc;
    },
    {} as Record<string, GroupedProducts>,
  );

  return (
    <>
      {Object.values(groupedProducts).map((category: GroupedProducts) => (
        <ProductCategory key={category.id} category={category} />
      ))}
    </>
  );
}

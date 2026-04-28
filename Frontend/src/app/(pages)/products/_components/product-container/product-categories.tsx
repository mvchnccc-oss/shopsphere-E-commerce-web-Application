import { Product } from "@/lib/interfaces/products.interface";
import ProductCategory from "./product-category";

interface ProductCategoriesProps {
  products: Product[];
}

interface GroupedCategory {
  id: number;
  name: string;
  products: Product[];
}

export default function ProductCategories({ products }: ProductCategoriesProps) {
  const grouped = products.reduce<Record<number, GroupedCategory>>((acc, product) => {
    const { id, name } = product.category;

    if (!acc[id]) {
      acc[id] = { id, name, products: [] };
    }

    acc[id].products.push(product);
    return acc;
  }, {});

  return (
    <>
      {Object.values(grouped).map((category) => (
        <ProductCategory key={category.id} category={category} />
      ))}
    </>
  );
}

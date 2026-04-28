import { Category } from "@/lib/interfaces/categories.interface";
import ProductCategories from "./product-categories";

interface ProductContainerProps {
  categories: Category[];
}

export default function ProductContainer({ categories }: ProductContainerProps) {
  return (
    <div className="py-7">
      <ProductCategories categories={categories} />
    </div>
  );
}

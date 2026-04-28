import { getProductsByCategory } from "@/lib/actions/products.actions";
import { Category } from "@/lib/interfaces/categories.interface";
import ProductCategory from "./product-category";

interface ProductCategoriesProps {
  categories: Category[];
}

const INITIAL_PRODUCTS_PER_CATEGORY = 10;

export default async function ProductCategories({ categories }: ProductCategoriesProps) {

  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const { products, totalPages } = await getProductsByCategory(
        category.id,
        0,
        INITIAL_PRODUCTS_PER_CATEGORY
      );
      return { category, products, hasMore: totalPages > 1 };
    })
  );

  return (
    <>
      {categoriesWithProducts.map(({ category, products, hasMore }) => (
        <ProductCategory
          key={category.id}
          category={category}
          initialProducts={products}
          hasMore={hasMore}
        />
      ))}
    </>
  );
}

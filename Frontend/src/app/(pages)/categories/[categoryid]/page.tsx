import ProductCard from "@/app/(pages)/products/_components/product-card";
import { getCategoryById } from "@/lib/actions/category.action";
import { getProductsByCategory } from "@/lib/actions/products.actions";
import { Category } from "@/lib/interfaces/categories.interface";
import { Products } from "@/lib/interfaces/products.interface";

export default async function page({ params }: { params: Promise<{ categoryid: string }> }) {
  const { categoryid } = await params;
  const categoryId = parseInt(categoryid);
  const categorydetails: Category = await getCategoryById(categoryId);
  const products: Products = await getProductsByCategory(categoryId);

  return (
    <>
      <div className="py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">{categorydetails.name} Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No products found in this category.</p>
        )}
      </div>
    </>
  );
}

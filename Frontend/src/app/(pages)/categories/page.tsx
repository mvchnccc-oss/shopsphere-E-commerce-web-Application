import { getAllCategories } from "@/lib/actions/category.action";
import CategoryContainer from "./_components/category-container";

export default async function page() {
  const categories = await getAllCategories();

  if (!categories) return <></>;

  return (
    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <CategoryContainer categories={categories} />
    </div>
  );
}

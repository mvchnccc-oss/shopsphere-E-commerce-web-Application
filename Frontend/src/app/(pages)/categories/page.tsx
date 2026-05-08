import { getAllCategories } from "@/lib/actions/category.action";
import CategoryContainer from "./_components/category-container";
import { AlertCircle } from "lucide-react";

export default async function page() {
  const result = await getAllCategories();

  if (!result.success) {
    return (
      <div className="py-10 px-4">
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <p className="text-lg font-medium">Failed to load categories</p>
          <p className="text-sm mt-1">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <CategoryContainer categories={result.data} />
    </div>
  );
}

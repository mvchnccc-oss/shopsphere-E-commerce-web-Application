
import LoadingImage from '@/components/loading-image';
import { getAllCategories } from '@/lib/actions/category.action';
import { Categories } from '@/lib/interfaces/categories.interface';
import Link from 'next/link';


export default async function page() {
 const categoriesList: Categories = await getAllCategories();


  return (
    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoriesList.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="flex flex-col items-center transition-all duration-500 gap-2 group"
          >

            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
              <LoadingImage
                src={cat.image}
                alt={cat.name}
                fill={true}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 200px"
                className="object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>

            <span className="font-semibold text-sm text-center">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.totalProducts} products</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

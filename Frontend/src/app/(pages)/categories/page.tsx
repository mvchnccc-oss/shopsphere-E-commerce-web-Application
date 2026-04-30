import CategoryImage from '@/components/CategoryImage';
import { getAllCategories } from '@/lib/actions/category.action';
import { categories } from '@/lib/interfaces/categories.interface';
import Link from 'next/link';


export default async function page() {
  const categories: categories = await getAllCategories();


  return (<>


    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="flex flex-col items-center gap-2 group"
          >
            {(!cat.image) ?
              <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-500">No Image</span>
              </div> :
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                <CategoryImage src={cat.image} alt={cat.name} />
              </div>
            }

            <span className="font-semibold text-sm text-center">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.totalProducts} products</span>
          </Link>
        ))}
      </div>
    </div>



  </>)
}

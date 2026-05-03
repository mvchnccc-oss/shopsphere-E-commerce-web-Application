"use client";
import LoadingImage from "@/components/loading-image";
import { Categories } from "@/lib/interfaces/categories.interface";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function CategoryContainer(props: { categories: Categories }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(props.categories);
  console.log(search);
  useEffect(() => {
    const filteredCategories = props.categories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

    setCategories(filteredCategories);
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 pt-6 pb-2 w-2xl mx-auto">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3.5 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-sm"
          />
          {search !== "" && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat) => (
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

export default CategoryContainer;

"use client";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 
  useEffect(() => {
    router.prefetch("/products");
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleChange(term: string) {
    setValue(term);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (term.trim()) {
        params.set("search", term.trim());
      }

      router.replace(term.trim() ? `/products?${params.toString()}` : "/products");
    }, 200);
  }

  function handleClear() {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    router.replace("/products");
    inputRef.current?.focus();
  }

  return (
    <div className="px-4 pt-6 pb-2 max-w-xl mx-auto">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 size-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-sm"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
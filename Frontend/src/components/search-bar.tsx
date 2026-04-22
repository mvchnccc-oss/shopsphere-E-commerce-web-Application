"use client";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");

  function handleSearch(value: string) {
    setSearch(value);
    onSearch(value);
  }

  return (
    <div className="relative mb-3 mx-2">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
    </div>
  );
}

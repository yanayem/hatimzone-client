"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select 
        className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer shadow-sm focus:ring-1 focus:ring-black"
        onChange={handleSortChange}
        defaultValue={currentSort}
    >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
    </select>
  );
}

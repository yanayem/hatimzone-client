"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiChevronDown,
  HiOutlineSearch,
} from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[999]">
      
      {/* LEVEL 1: TOP MENU BAR */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20 relative">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-black text-black uppercase tracking-wider">
          HatimZone
        </Link>

        {/* TOP MENU LINKS - MANUALLY HANDLED AS REQUESTED */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          
          {/* HOME */}
          <Link href="/" className="font-bold text-black uppercase text-sm hover:text-pink-600 transition-colors">
            Home
          </Link>

          {/* SHOP */}
          <Link href="/shop" className="font-bold text-black uppercase text-sm hover:text-pink-600 transition-colors">
            Shop
          </Link>

          {/* COLLECTIONS (DROPDOWN) */}
          <div
            className="h-full flex items-center relative"
            onMouseEnter={() => setOpenDropdown("collections")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`font-bold uppercase text-sm flex items-center gap-1 transition-colors ${
                openDropdown === "collections" ? "text-pink-600" : "text-black"
              }`}
            >
              Collections
              <HiChevronDown
                className={`transition-transform duration-200 ${
                  openDropdown === "collections" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}
            {openDropdown === "collections" && (
              <ul className="absolute left-1/2 top-full mt-2 w-max bg-pink-600 shadow-2xl border border-blue-200 rounded-b-xl p-6 flex gap-8 flex-wrap max-w-[90vw] -translate-x-1/2 z-[99999]">
                
                {categories.map((cat, cIdx) => (
                  <li key={cIdx} className="min-w-[180px]">
                    
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="font-semibold mb-3 block bg-amber-800 text-blue-600 hover:text-blue-500 uppercase text-xs tracking-wider"
                    >
                      {cat.name}
                    </Link>

                    <ul className="flex flex-col gap-1">
                      {cat.subCategories?.map((subItem, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            href={`/shop?category=${encodeURIComponent(
                              cat.name
                            )}&sub=${encodeURIComponent(subItem)}`}
                            className="block text-sm py-1.5 px-3 rounded text-blue-600 hover:bg-blue-50 hover:text-pink-600 hover:border-l-2 hover:border-blue-400 transition-all"
                          >
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}

                {categories.length === 0 && (
                  <p className="text-xs text-blue-600 uppercase font-bold italic py-4">
                    New Collections Soon
                  </p>
                )}
              </ul>
            )}
          </div>

          <Link href="/contact" className="font-bold text-black uppercase text-sm hover:text-pink-600 transition-colors">
            Support
          </Link>
        </nav>

        {/* SEARCH & ICONS */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block mr-2">
            <HiOutlineSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 w-48 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-pink-300"
            />
          </div>
          <Link href="/wishlist" className="hover:text-pink-600">
            <HiOutlineHeart className="w-6 h-6 text-gray-800" />
          </Link>
          <Link href="/cart" className="relative hover:text-pink-600">
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-800" />
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
          </Link>
          <Link href="/account" className="hover:text-pink-600">
            <HiOutlineUser className="w-6 h-6 text-gray-800" />
          </Link>
        </div>

      </div>
    </header>
  );
}
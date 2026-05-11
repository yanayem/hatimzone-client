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
import { useCart } from "@/components/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20 relative">
        
        <Link href="/" className="text-xl font-black text-black uppercase tracking-wider">
          HatimZone
        </Link>

        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link href="/" className="font-bold text-gray-800 uppercase text-[13px] hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="font-bold text-gray-800 uppercase text-[13px] hover:text-blue-600 transition-colors">
            Shop
          </Link>

          <div
            className="h-full flex items-center relative"
            onMouseEnter={() => setOpenDropdown("collections")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`font-bold uppercase text-[13px] flex items-center gap-1 transition-colors ${
                openDropdown === "collections" ? "text-blue-600" : "text-gray-800"
              }`}
            >
              Collections
              <HiChevronDown className={`transition-transform duration-200 ${openDropdown === "collections" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "collections" && (
              <ul className="absolute left-1/2 top-full mt-0 w-max bg-white shadow-2xl border border-gray-100 rounded-b-2xl p-6 flex gap-10 flex-wrap max-w-[90vw] -translate-x-1/2 z-[99999]">
                {categories.map((cat, cIdx) => (
                  <li key={cIdx} className="min-w-[160px]">
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="font-black mb-3 block text-gray-900 uppercase text-xs tracking-widest border-b pb-2 hover:text-blue-600 transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 font-bold italic py-4">New Collections Soon</p>
                )}
              </ul>
            )}
          </div>

          <Link href="/contact" className="font-bold text-gray-800 uppercase text-[13px] hover:text-blue-600 transition-colors">
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <div className="relative hidden sm:block mr-2">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 w-44 bg-gray-50 border border-transparent rounded-full text-xs focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
            />
          </div>
          <Link href="/wishlist" className="relative group">
            <HiOutlineHeart className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative group">
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                {cart.length}
              </span>
            )}
          </Link>
          <Link href="/account" className="group">
            <HiOutlineUser className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
          </Link>
        </div>

      </div>
    </header>
  );
}
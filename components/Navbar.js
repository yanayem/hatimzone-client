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

  if (pathname.startsWith("/admin") || pathname === "/landing") return null;

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-20 relative">

        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="HatimZone" className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-110" />
          <span className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter hover:text-blue-600 transition-colors">
            HatimZone
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link href="/" className={`font-bold uppercase text-[12px] tracking-widest transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            Home
          </Link>
          <Link href="/shop" className={`font-bold uppercase text-[12px] tracking-widest transition-colors ${pathname === '/shop' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            Shop Lamps
          </Link>
          <Link href="/about" className={`font-bold uppercase text-[12px] tracking-widest transition-colors ${pathname === '/about' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            About
          </Link>
          <Link href="/contact" className={`font-bold uppercase text-[12px] tracking-widest transition-colors ${pathname === '/contact' ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          {/* SEARCH BAR (Commented out)
          <div className="relative hidden lg:block">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lamps..."
              className="pl-9 pr-4 py-2 w-40 xl:w-56 bg-gray-50 border border-transparent rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
            />
          </div>
          */}
          
          {/* WISHLIST (Commented out)
          <Link href="/wishlist" className="relative group p-2">
            <HiOutlineHeart className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-black shadow-lg">
                {wishlist.length}
              </span>
            )}
          </Link>
          */}

          <Link href="/cart" className="relative group p-2">
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-black text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-black shadow-lg">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/account" className="p-2 hidden sm:block">
            <HiOutlineUser className="w-6 h-6 text-gray-800 hover:text-blue-600 transition" />
          </Link>
          
          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden p-2 text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}

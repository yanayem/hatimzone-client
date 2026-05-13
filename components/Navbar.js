"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();

  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // LOCK BODY SCROLL WHEN SIDEBAR OPEN
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/landing"))
    return null;

  return (
    <header className="sticky top-0 z-[999] w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-16 sm:h-18 lg:h-20 px-4 sm:px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="HatimZone"
            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 object-contain"
          />

          <span className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight text-black hover:text-green-600 transition truncate max-w-[150px] xs:max-w-none">
            HatimZone
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {[
            { label: "Home", href: "/" },
            { label: "Shop Lamps", href: "/shop" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative text-[11px] lg:text-[12px]
                font-bold uppercase tracking-[2px]
                transition-all duration-300
                ${pathname === item.href
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600"
                }
              `}
            >
              {item.label}

              <span
                className={`
                  absolute left-0 -bottom-1 h-[2px]
                  bg-green-600 transition-all duration-300
                  ${pathname === item.href
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                  }
                `}
              />
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1 sm:gap-3 lg:gap-5">

          {/* CART */}
          <Link href="/cart" className="relative p-2 group">
            <HiOutlineShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-green-600 transition" />

            {cart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white text-[12px] font-bold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* ACCOUNT / TRACKING */}
          <Link href="/account" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all duration-300 group border border-gray-100">
            <HiOutlineUser className="w-4 h-4 text-gray-800 group-hover:text-white transition" />
            <span className="text-[12px] font-black uppercase tracking-widest">Tracking Order</span>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <HiMenu className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm
          transition-all duration-300 md:hidden
          z-[1000]
          ${isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }
        `}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          w-[82%] max-w-[320px]
          bg-white shadow-2xl
          z-[1001]
          transition-transform duration-500 ease-in-out
          md:hidden
          flex flex-col
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="HatimZone"
              className="w-8 h-8 object-contain"
            />

            <span className="text-xl font-black uppercase tracking-tight">
              HatimZone
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <HiX className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {[
            { label: "Home", href: "/" },
            { label: "Shop Lamps", href: "/shop" },
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Order Track", href: "/account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block rounded-xl px-5 py-4
                md:text-lg text-xs
                font-black uppercase tracking-wide
                transition-all duration-300
                ${pathname === item.href
                  ? "bg-black text-white shadow-lg scale-[1.02]"
                  : "text-black hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-gray-100 p-5 bg-gray-50/50">
          <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 text-center">
            © 2026 HatimZone
          </p>
          <Link
            href="/policies"
            className="block text-[12px] font-black uppercase tracking-widest text-green-600 text-center mt-2 hover:underline"
          >
            Privacy & Terms
          </Link>
        </div>
      </aside>
    </header>
  );
}

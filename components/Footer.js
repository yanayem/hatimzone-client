"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineExternalLink
} from "react-icons/hi";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on admin and landing pages
  if (pathname.startsWith("/admin") || pathname === "/landing") return null;

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="HatimZone Logo" className="w-12 h-12 object-contain" />
              <span className="text-xl font-black uppercase tracking-tighter">HatimZone</span>
            </Link>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Elevating living spaces across Bangladesh with premium, handpicked lighting designs. Every lamp tells a unique story of elegance and warmth.
            </p>
          </div>

          {/* Quick Links (Commented out as requested)
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Shop Collection</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">All Lamps</Link></li>
              <li><Link href="/shop?category=Table%20Lamps" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">Table Lamps</Link></li>
              <li><Link href="/shop?category=Chandelier" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">Chandeliers</Link></li>
              <li><Link href="/shop?category=Floor%20Lamps" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">Floor Lamps</Link></li>
            </ul>
          </div>
          */}

          {/* Company */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Customer Care</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">About Us</Link></li>
              <li><Link href="/contact" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">Contact & Support</Link></li>
              <li><Link href="/account" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">Track Order</Link></li>
              <li><Link href="/wishlist" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Get In Touch</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <HiOutlinePhone className="text-xl text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                  <a href="tel:01700-000000" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">01700-000000</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HiOutlineMail className="text-xl text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  <a href="mailto:support@hatimzone.com" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition">support@hatimzone.com</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center md:text-left">
            © 2026 HatimZone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition">Privacy</Link>
             <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition">Terms</Link>
             <Link href="/admin" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:underline">
               Admin Panel <HiOutlineExternalLink />
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

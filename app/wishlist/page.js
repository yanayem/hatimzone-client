"use client";

import React from "react";
import Link from "next/link";
import { HiHeart, HiTrash, HiArrowLeft, HiShoppingCart } from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiHeart className="text-3xl text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Wishlist is empty</h1>
          <p className="text-gray-500 mb-8">Save your favorite items to keep track of them here.</p>
          <Link 
            href="/shop" 
            className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition"
          >
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">My Wishlist</h1>
          <span className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-gray-100">
            {wishlist.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 flex flex-col">
              <div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-contain transition duration-500 group-hover:scale-110 p-4"
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-500 hover:text-white transition group/btn"
                >
                  <HiTrash className="text-xl" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-2">{product.brand}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-2xl font-black text-gray-900">
                      ৳{product.discountPrice || product.price}
                    </p>
                    {product.discountPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ৳{product.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link 
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-center py-3 bg-gray-50 rounded-xl font-bold text-sm hover:bg-gray-100 transition"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition shadow-lg shadow-gray-100"
                  >
                    <HiShoppingCart />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-semibold mt-12">
          <HiArrowLeft />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

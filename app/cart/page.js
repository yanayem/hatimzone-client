"use client";

import React from "react";
import Link from "next/link";
import { HiPlus, HiMinus, HiTrash, HiArrowLeft } from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subTotal = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity, // (item.discountPrice || item.price) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white border shadow-sm rounded-[2rem] p-8 md:p-10 text-center max-w-md w-full">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            No lamps in your cart yet
          </h1>
          <p className="text-gray-500 mt-2 mb-6 text-sm md:text-base">
            Light up your home by adding some beautiful lamps!
          </p>

          <Link
            href="/shop"
            className="block bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-900 transition"
          >
            Browse Lamps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-2">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Your Lighting Cart
          </h1>

          <span className="text-xs md:text-sm text-gray-600 font-bold uppercase tracking-widest">
            {cart.length} lights selected
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

          {/* LEFT CART ITEMS */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">

            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm hover:shadow-md transition"
              >

                {/* IMAGE (MODERN FIXED SIZE) */}
                <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={item.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest mb-1">{item.brand || 'Premium Lighting'}</p>
                  <h3 className="text-gray-900 font-bold text-lg md:text-xl leading-tight mb-2">
                    {item.name}
                  </h3>

                  {item.variant && (
                    <p className="text-xs text-gray-600 font-medium">
                      {item.variant.size} {item.variant.color} {item.variant.material}
                    </p>
                  )}

                  <p className="text-black font-black text-lg mt-3">
                    ৳{item.price.toLocaleString()}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">

                  <button
                    onClick={() =>
                      removeFromCart(item._id, item.variant)
                    }
                    className="text-gray-600 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg order-2 sm:order-1"
                  >
                    <HiTrash className="text-xl" />
                  </button>

                  <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 gap-4 order-1 sm:order-2">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity - 1,
                          item.variant
                        )
                      }
                      className="text-gray-500 hover:text-black transition"
                    >
                      <HiMinus />
                    </button>

                    <span className="w-6 text-center font-black text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity + 1,
                          item.variant
                        )
                      }
                      className="text-gray-500 hover:text-black transition"
                    >
                      <HiPlus />
                    </button>

                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black mt-8 font-bold uppercase tracking-widest text-[11px] transition-colors"
            >
              <HiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-8 h-fit lg:sticky lg:top-24 shadow-sm">

            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm text-gray-500 font-medium">

              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-black text-gray-900">
                  ৳{subTotal.toLocaleString()}
                </span>
              </div>

              {/*<div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-[11px] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                  Free Over ৳5000
                </span>
              </div>*/}

            </div>

            <div className="border-t border-gray-50 mt-6 pt-6 flex justify-between items-center">
              <span className="text-gray-900 font-bold uppercase tracking-widest text-[11px]">Total Amount</span>
              <span className="text-2xl font-black text-gray-900">৳{subTotal.toLocaleString()}</span>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 space-y-3">

              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition shadow-xl"
              >
                Proceed to Checkout
              </Link>

              <p className="text-[11px] text-gray-600 text-center font-bold uppercase tracking-widest pt-4">
                Secure Lighting Checkout
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

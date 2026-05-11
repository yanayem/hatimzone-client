"use client";

import React from "react";
import Link from "next/link";
import { HiPlus, HiMinus, HiTrash, HiArrowLeft } from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subTotal = cart.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.price) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border shadow-sm rounded-3xl p-10 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mt-2 mb-6">
            Add items to continue shopping
          </p>

          <Link
            href="/shop"
            className="block bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          <span className="text-sm text-gray-500">
            {cart.length} items
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-4 flex items-center gap-5 shadow-sm hover:shadow-md transition"
              >

                {/* IMAGE (MODERN FIXED SIZE) */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold truncate">
                    {item.name}
                  </h3>

                  {item.variant && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.variant.size} {item.variant.color}
                    </p>
                  )}

                  <p className="text-gray-900 font-bold mt-2">
                    ৳{item.discountPrice || item.price}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col items-end gap-3">

                  <button
                    onClick={() =>
                      removeFromCart(item._id, item.variant)
                    }
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <HiTrash className="text-lg" />
                  </button>

                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity - 1,
                          item.variant
                        )
                      }
                      className="hover:text-black"
                    >
                      <HiMinus />
                    </button>

                    <span className="w-8 text-center font-semibold text-sm">
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
                      className="hover:text-black"
                    >
                      <HiPlus />
                    </button>

                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-black mt-6 font-medium"
            >
              <HiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white border rounded-2xl p-6 h-fit sticky top-24 shadow-sm">

            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  ৳{subTotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">
                  Calculated at checkout
                </span>
              </div>

            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>৳{subTotal}</span>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 space-y-3">

              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Buy Now
              </Link>

              <Link
                href="/checkout"
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
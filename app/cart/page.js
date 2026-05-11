"use client";

import React from "react";
import Link from "next/link";
import { HiPlus, HiMinus, HiTrash, HiArrowLeft } from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiTrash className="text-3xl text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/shop" 
            className="block w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-gray-500 font-medium">{cart.length} Items</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.variant.size} {item.variant.color}
                    </p>
                  )}
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ৳{item.discountPrice || item.price}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <button 
                    onClick={() => removeFromCart(item._id, item.variant)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <HiTrash className="text-xl" />
                  </button>
                  
                  <div className="flex items-center border rounded-full px-3 py-1">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1, item.variant)}
                      className="p-1 hover:text-blue-600"
                    >
                      <HiMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1, item.variant)}
                      className="p-1 hover:text-blue-600"
                    >
                      <HiPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-semibold pt-4">
              <HiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">৳{subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">৳{subTotal}</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="block w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-black shadow-lg shadow-gray-200 transition"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">🚚</div>
                  <p>Fast delivery across the country</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">🛡️</div>
                  <p>Secure payment methods available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

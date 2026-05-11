"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiCheckCircle, HiShoppingBag, HiUser } from "react-icons/hi";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <HiCheckCircle className="text-5xl text-green-600" />
        </div>
        
        <h1 className="text-3xl font-black mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. Your order <span className="font-bold text-black">#{orderId}</span> has been received and is being processed.
        </p>

        <div className="space-y-4">
          <Link 
            href="/account" 
            className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg shadow-gray-200"
          >
            <HiUser className="text-xl" />
            View Order History
          </Link>
          
          <Link 
            href="/shop" 
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
          >
            <HiShoppingBag className="text-xl" />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            A confirmation has been sent to your phone
          </p>
        </div>
      </div>
    </div>
  );
}

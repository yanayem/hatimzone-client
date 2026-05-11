"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiCheckCircle, HiShoppingBag, HiUser } from "react-icons/hi";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-sm max-w-lg w-full text-center border border-gray-100">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <HiCheckCircle className="text-4xl md:text-5xl text-green-600" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter">Order Received!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base font-medium">
          Thank you for choosing our lighting. Your home is about to get brighter! Your order <span className="font-bold text-black">#{orderId || 'N/A'}</span> is now being prepared for delivery.
        </p>

        <div className="space-y-4">
          <Link 
            href="/account" 
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-800 transition shadow-xl"
          >
            <HiUser className="text-xl" />
            Track Your Order
          </Link>
          
          <Link 
            href="/shop" 
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-50 transition"
          >
            <HiShoppingBag className="text-xl" />
            Browse More Lamps
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-widest">
          A confirmation SMS will be sent shortly
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

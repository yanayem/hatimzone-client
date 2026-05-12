import React from "react";
import Link from "next/link";
import { HiArrowLeft, HiOutlineLightBulb } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Decorative Element */}
        <div className="mb-10 relative">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 flex items-center justify-center mx-auto relative z-10">
            <HiOutlineLightBulb className="text-6xl text-gray-200" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-gray-50/50 -z-10 tracking-tighter">
                404
            </div>
          </div>
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl -z-20"></div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Light Not Found
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed mb-12">
          The page you are looking for has been moved or doesn't exist. Let's get you back into the light.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            <HiArrowLeft className="text-xl" />
            Back to Home
          </Link>
          
          <Link
            href="/shop"
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95"
          >
            Browse Collections
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                HatimZone · Premium Lighting Store
            </p>
        </div>
      </div>
    </div>
  );
}

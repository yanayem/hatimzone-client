"use client";

import React from "react";
import Link from "next/link";
import { HiCheckCircle, HiShoppingBag, HiTruck, HiX } from "react-icons/hi";

export default function SuccessModal({ isOpen, onClose, orderId }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-8 md:p-12 text-center shadow-2xl animate-scale-up overflow-hidden border border-gray-100">
                {/* Decorative Background Element */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-transparent -z-10"></div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition"
                >
                    <HiX className="text-2xl" />
                </button>

                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200">
                    <HiCheckCircle className="text-6xl animate-bounce" />
                </div>

                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-none">
                    Order <br />
                    <span className="text-green-600">Successful!</span>
                </h2>

                <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4">
                    Your order <span className="text-black font-black">#{orderId || "N/A"}</span> has been placed. We'll start preparing your lamp right away!
                </p>

                <div className="space-y-4">
                    <Link
                        href="/account"
                        className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all shadow-xl active:scale-95"
                    >
                        <HiTruck className="text-xl" />
                        Track Order Now
                    </Link>

                    <Link
                        href="/shop"
                        onClick={onClose}
                        className="flex items-center justify-center gap-3 w-full bg-gray-50 text-gray-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all border border-gray-200 active:scale-95"
                    >
                        <HiShoppingBag className="text-xl" />
                        Back to Shop
                    </Link>
                </div>

                <div className="mt-10 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        HatimZone · Premium Lighting
                    </span>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-up {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
}

"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="relative">
        {/* Animated Rings */}
        <div className="w-24 h-24 rounded-full border-[3px] border-gray-100 border-t-black animate-spin"></div>
        <div className="absolute inset-0 w-24 h-24 rounded-full border-[3px] border-transparent border-b-blue-600 animate-spin-reverse opacity-50"></div>
        
        {/* Central Logo or Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-gray-900 mb-2">HatimZone</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 animate-pulse">
            Lighting up your space...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

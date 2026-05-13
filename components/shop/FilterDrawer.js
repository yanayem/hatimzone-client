"use client";

import React, { useState, useEffect } from "react";
import { HiFilter, HiX } from "react-icons/hi";

export default function FilterDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer when escape key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-xl active:scale-95 transition-all w-full justify-center"
      >
        <HiFilter className="text-lg" />
        Filter Products
      </button>

      {/* Desktop Sidebar (Visible only on lg+) */}
      <aside className="hidden lg:block w-72 space-y-10 shrink-0">
        {children}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[500] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[80vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out translate-x-0">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
               <h2 className="text-sm font-black uppercase tracking-widest">Filters</h2>
               <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-500 hover:text-black transition"
               >
                  <HiX />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {children}
            </div>

            <div className="p-6 border-t border-gray-100">
               <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px]"
               >
                  Show Results
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

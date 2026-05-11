"use client";

import React, { useState } from "react";
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineChatAlt2,
  HiCheckCircle,
  HiOutlineArrowRight
} from "react-icons/hi";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            Get in <span className="italic font-light text-slate-400">Touch.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-xl mx-auto uppercase tracking-widest">
            We're here to help you find the perfect lighting for your home.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24">
        {/* CONTACT INFO CARDS - NOW CENTERED AND RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 text-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <HiOutlinePhone className="text-2xl" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Call Us</h3>
            <p className="text-slate-500 font-bold mb-4 text-sm md:text-base">Monday - Saturday (10AM - 8PM)</p>
            <a href="tel:01700-000000" className="text-xl md:text-2xl font-black text-blue-600 hover:underline transition">01700-000000</a>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 text-center">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <HiOutlineMail className="text-2xl" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Email Support</h3>
            <p className="text-slate-500 font-bold mb-4 text-sm md:text-base">We usually reply within 24 hours.</p>
            <a href="mailto:support@hatimzone.com" className="text-xl md:text-2xl font-black text-green-600 hover:underline transition">support@hatimzone.com</a>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 text-center">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <HiOutlineLocationMarker className="text-2xl" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Showroom</h3>
            <p className="text-slate-500 font-bold text-sm md:text-base">Dhaka, Bangladesh</p>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Visit us for a live demo of our premium collection.</p>
          </div>
        </div>

        {/* 
        CONTACT FORM SECTION (Commented out as requested)
        <div className="lg:col-span-2 mt-12">
          <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative h-full">
            ... form implementation ...
          </div>
        </div>
        */}
      </div>

      {/* 
      MAP SECTION (Commented out as requested)
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-white p-4 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden h-96">
          ... map placeholder ...
        </div>
      </section>
      */}
    </div>
  );
}

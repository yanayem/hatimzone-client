"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlineScale, HiArrowLeft } from "react-icons/hi";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* HEADER */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
            Policies & <span className="italic font-light text-slate-400">Terms.</span>
          </h1>
          <p className="text-slate-400 text-[10px] sm:text-sm md:text-lg font-bold max-w-xl mx-auto uppercase tracking-[0.2em]">
            Your trust and security are our top priorities.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-10 md:-mt-16">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          
          {/* TABS / QUICK LINKS */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 px-6 py-5 text-center border-r border-gray-100 bg-gray-50/50">
              <HiOutlineShieldCheck className="mx-auto text-2xl text-blue-600 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Privacy</span>
            </div>
            <div className="flex-1 px-6 py-5 text-center">
              <HiOutlineDocumentText className="mx-auto text-2xl text-orange-600 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terms</span>
            </div>
          </div>

          <div className="p-8 md:p-16 space-y-12 md:space-y-16">
            
            {/* PRIVACY POLICY */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <HiOutlineShieldCheck className="text-xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Privacy Policy</h2>
              </div>
              
              <div className="prose prose-slate max-w-none space-y-6">
                <p className="text-slate-600 font-medium leading-relaxed">
                  At HatimZone, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our store or make a purchase.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">1. Information We Collect</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    When you make a purchase, we collect your name, phone number, and delivery address to process your order. We do not store sensitive payment information on our servers.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">2. How We Use Data</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Your data is used solely for order fulfillment, customer support, and, if you opt-in, occasional updates about new collections or lighting tips. We never sell your data to third parties.
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100 w-full" />

            {/* TERMS OF SERVICE */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <HiOutlineScale className="text-xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Terms of Service</h2>
              </div>
              
              <div className="prose prose-slate max-w-none space-y-6">
                <p className="text-slate-600 font-medium leading-relaxed">
                  By accessing and using HatimZone, you agree to comply with the following terms and conditions. Please read them carefully before making a purchase.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">1. Product Descriptions</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    We strive to display our lamps as accurately as possible. However, due to the nature of lighting and screen calibrations, slight variations in color or finish may occur.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">2. Delivery & Returns</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Orders are typically processed within 24-48 hours. We offer replacements for items damaged during transit. Please inspect your package upon arrival and contact us immediately if there are any issues.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* FOOTER ACTION */}
          <div className="bg-slate-50 p-8 md:p-12 text-center border-t border-gray-100">
            <p className="text-sm text-slate-400 font-bold mb-6">Have more questions about our policies?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-lg">
              Contact Support
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-black font-black uppercase tracking-widest text-[10px] transition">
            <HiArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

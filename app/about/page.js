"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineLightBulb, HiOutlineStar, HiOutlineUserGroup, HiArrowRight } from "react-icons/hi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO SECTION */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=2000&auto=format&fit=crop"
            alt="About HatimZone"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
            Our Story <br />
            <span className="italic font-light text-slate-300">Of Light.</span>
          </h1>
          <p className="text-sm md:text-xl font-light text-slate-200 max-w-2xl mx-auto leading-relaxed">
            HatimZone was born out of a passion for exquisite design and the belief that the right light can transform any space into a masterpiece.
          </p>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.2em]">
              The Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Elevating Living Spaces through <span className="text-blue-600 underline decoration-4 underline-offset-8">Artistic Illumination.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Since our inception, we have dedicated ourselves to sourcing and designing the finest lamps for the Bangladeshi market. We believe in quality, durability, and most importantly, the aesthetic harmony that a perfect lamp brings to your home.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">5,000+</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Happy Homes</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">200+</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unique Designs</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Craftsmanship"
              />
            </div>
            <div className="absolute -bottom-6 md:-bottom-10 -left-6 md:-left-10 bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-gray-100 hidden sm:block">
              <HiOutlineLightBulb className="text-3xl md:text-5xl text-blue-600 mb-2 md:mb-4" />
              <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Handpicked Quality</p>
              <p className="text-[9px] md:text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Every lamp tells a story</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <HiOutlineStar className="text-3xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Premium Quality</h3>
              <p className="text-slate-500 font-medium leading-relaxed">We never compromise on materials. From solid brass to hand-blown glass, every detail matters.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <HiOutlineLightBulb className="text-3xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Innovation</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Blending traditional aesthetics with modern LED technology for energy-efficient, stunning light.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <HiOutlineUserGroup className="text-3xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Customer Trust</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Providing doorstep delivery across Bangladesh with a commitment to seamless customer support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-8">Ready to brighten your world?</h2>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition active:scale-95 shadow-2xl">
            Browse Our Collection <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}

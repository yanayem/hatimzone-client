export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { 
  HiOutlineCollection, 
  HiOutlineStar, 
  HiOutlineTrendingUp, 
  HiArrowRight, 
  HiOutlineSparkles,
  HiPlus
} from "react-icons/hi";

export default async function HomePage() {
  let newArrival = [];
  let topSelling = [];
  let categories = [];

  try {
    await connectDB();

    // Parallel data fetching for better performance
    const results = await Promise.all([
      Product.find({ isNewArrival: true })
        .select("name price cover slug brand isNewArrival")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Product.find({ isTopSelling: true })
        .select("name price cover slug brand isNewArrival")
        .limit(8)
        .lean(),
      Product.distinct("category")
    ]);
    
    newArrival = results[0] || [];
    topSelling = results[1] || [];
    categories = results[2] || [];
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }


  return (
    <div className="bg-gray-100 text-slate-950 min-h-screen selection:bg-zinc-200">
      
      {/* HERO: FEATURING YOUR SELECTED LAMP */}
      <section className="relative h-[85vh] md:h-[100vh] flex items-center overflow-hidden bg-zinc-100">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop" 
            alt="Minimalist Table Lamp"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          {/* Soft vignette to make text readable without hiding the lamp */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 md:mb-8 transition-transform hover:scale-105">
              <HiOutlineSparkles className="text-amber-300 text-xs md:text-base" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Premium Lighting Collection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-4 md:mb-8 uppercase">
              Perfect light <br />
              <span className="italic font-light text-amber-100">for every mood.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-xl text-slate-200 mb-6 md:mb-10 max-w-md font-medium leading-relaxed">
              Elevate your living space with our collection of modern, minimalist lighting solutions.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white text-slate-950 px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold hover:bg-amber-400 transition-all duration-500 group shadow-xl text-sm md:text-base"
            >
              Shop Collection
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES - LIGHTWEIGHT CHIPS */}
      {/*<section className="py-12 md:py-16 border-b border-zinc-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">Lighting Types:</span>
            {categories.map((cat) => (
              <Link 
                key={cat}
                href={`/shop?category=${cat}`}
                className="px-5 md:px-6 py-2 rounded-full border border-zinc-200 text-xs md:text-sm font-medium hover:border-slate-950 hover:bg-slate-950 hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <HiOutlineTrendingUp />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">New Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-950">Latest Lamp Designs</h2>
          </div>
         
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
          {newArrival.map((p) => (
            <ProductCard key={p._id.toString()} product={p} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link 
            href="/shop" 
            className="group flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            See All Lamps Collection
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FEATURED / TOP SELLING */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-100 text-slate-950">
              <HiOutlineStar />
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Best Selling Lighting</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
            {topSelling.map((p) => (
              <ProductCard key={p._id.toString()} product={p} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link 
              href="/shop" 
              className="group flex items-center gap-3 bg-white border-2 border-black text-black px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-lg active:scale-95"
            >
              Shop Best Sellers
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div 
      className="group flex flex-col h-full bg-white border border-zinc-200 rounded-lg overflow-hidden transition-all hover:shadow-xl hover:border-zinc-300"
    >
      <Link href={`/product/${product.slug || product._id}`} className="relative aspect-[4/5] overflow-hidden bg-zinc-50 border-b border-zinc-100 block">
        <img
          src={product.cover || "https://placehold.co/600x800/e4e4e7/52525b?text=No+Image"}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt={product.name}
          loading="lazy"
        />
        
        {product.isNewArrival && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
              New
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {product.brand || 'Premium Lighting'}
          </p>
          <p className="text-sm font-black text-slate-950">
            ৳{product.price.toLocaleString()}
          </p>
        </div>
        
        <Link href={`/product/${product.slug || product._id}`}>
          <h3 className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-1 mb-6">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link 
            href={`/product/${product.slug || product._id}`}
            className="flex items-center justify-center  md:text-sm gap-1 py-2 px-1 border border-black rounded text-[9px] font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-all"
          >
            See Details
          </Link>
          <Link 
            href={`/product/${product.slug || product._id}`}
            className="flex items-center justify-center  md:text-sm gap-1 py-2 px-1 bg-black text-white rounded text-[9px] font-black uppercase tracking-tighter hover:bg-blue-600 transition-all shadow-md"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

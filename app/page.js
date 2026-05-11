import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { 
  HiOutlineCollection, 
  HiOutlineStar, 
  HiOutlineTrendingUp, 
  HiArrowRight, 
  HiOutlineSparkles 
} from "react-icons/hi";

export default async function HomePage() {
  await connectDB();

  // Parallel data fetching for better performance
  const [newArrival, topSelling, categories] = await Promise.all([
    Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8).lean(),
    Product.find({ isTopSelling: true }).limit(8).lean(),
    Product.distinct("category")
  ]);

  return (
    <div className="bg-white text-slate-950 min-h-screen selection:bg-zinc-200">
      
      {/* HERO: FEATURING YOUR SELECTED LAMP */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-zinc-100">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2070&auto=format&fit=crop" 
            alt="Minimalist Table Lamp"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          {/* Soft vignette to make text readable without hiding the lamp */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8">
              <HiOutlineSparkles className="text-amber-300" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Premium Lighting</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-light leading-tight tracking-tighter mb-8">
              Perfect light <br />
              <span className="italic font-serif text-amber-100">for every mood.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-md font-light leading-relaxed">
              Elevate your living space with our collection of modern, minimalist lighting solutions.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-full font-bold hover:bg-amber-400 transition-all duration-500 group shadow-xl"
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
          <Link href="/shop" className="text-sm font-medium border-b border-slate-950 pb-1 hover:text-zinc-500 hover:border-zinc-300 transition-all">
            See All Lamps
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
          {newArrival.map((p) => (
            <ProductCard key={p._id.toString()} product={p} />
          ))}
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
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link 
      href={`/product/${product.slug || product._id}`} 
      className="group flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-2xl mb-4 md:mb-6">
        <img
          src={product.cover || "https://placehold.co/600x800/e4e4e7/52525b?text=No+Image"}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt={product.name}
          loading="lazy"
        />
        
        {product.isNewArrival && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4">
            <span className="bg-white/90 backdrop-blur-sm text-slate-950 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              New Light
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {product.brand || 'Premium Lighting'}
          </p>
          <p className="text-xs md:text-sm font-medium text-slate-950">
            ৳{product.price.toLocaleString()}
          </p>
        </div>
        
        <h3 className="text-base md:text-lg font-normal text-slate-800 group-hover:text-slate-950 transition-colors line-clamp-1 mb-3 md:mb-4">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-tighter opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all transform translate-y-0 sm:translate-y-2 group-hover:translate-y-0">
          <span>View Details</span>
          <HiArrowRight />
        </div>
      </div>
    </Link>
  );
}
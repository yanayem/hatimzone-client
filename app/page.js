import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";

export default async function HomePage() {
  await connectDB();

  // Fetch data using the new explicit boolean flags
  const newArrival = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8);
  const topSelling = await Product.find({ isTopSelling: true }).limit(8);
  const featured = await Product.find({ isFeatured: true }).limit(4);

  const categories = await Product.distinct("category");

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">

      {/* HERO SECTION - Premium Look */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Hatim Zone
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
            Elevate your lifestyle with our curated collection of premium goods. High quality, fair prices.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105 shadow-xl">
              Shop Collection
            </Link>
            <Link href="/new" className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition transform hover:scale-105">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold">Shop by Category</h2>
                <div className="w-12 h-1 bg-black mt-2"></div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? categories.map((cat, i) => (
            <Link 
                href={`/shop?category=${cat}`} 
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition group"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-white transition">
                🛍️
              </div>
              <span className="font-bold text-sm uppercase tracking-wider">{cat}</span>
            </Link>
          )) : (
            <div className="col-span-full text-center text-gray-400 py-10">No categories found yet.</div>
          )}
        </div>
      </section>

      {/* FEATURED SECTION */}
      {featured.length > 0 && (
        <section className="bg-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Must-Haves</h2>
                    <p className="text-gray-500">Our hand-picked featured collection</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* NEW ARRIVAL */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">New Arrival</h2>
          <Link href="/shop" className="text-sm font-bold underline">View All</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrival.length > 0 ? newArrival.map((p) => (
            <ProductCard key={p._id} product={p} />
          )) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                Check back soon for new arrivals!
            </div>
          )}
        </div>
      </section>

      {/* TOP SELLING */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold">Top Selling</h2>
                <Link href="/shop" className="text-sm font-bold underline">View All</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topSelling.length > 0 ? topSelling.map((p) => (
                <ProductCard key={p._id} product={p} />
            )) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                    Your best sellers will appear here.
                </div>
            )}
            </div>
        </div>
      </section>
       {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto p-6 grid md:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-gray-800">24/7 Live Chat</h2>
          <p className="text-gray-600">Instant help anytime</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-gray-800">Express Shipping</h2>
          <p className="text-gray-600">Fast delivery</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-gray-800">Secure Payment</h2>
          <p className="text-gray-600">Safe transactions</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-gray-800">Best Quality</h2>
          <p className="text-gray-600">Premium items</p>
        </div>

      </section>

    </div>
  );
}

// Reusable Product Card Component
function ProductCard({ product }) {
    const hasDiscount = product.discountPrice > 0;
    const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                    src={product.images?.[0] || "https://placehold.co/400x500?text=Product"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    alt={product.name}
                />
                
                {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded">
                        -{discountPercent}%
                    </div>
                )}

                <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    🛒
                </button>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</span>
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-black transition">{product.name}</h3>
                
                <div className="mt-auto flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-lg font-black text-black">${product.discountPrice}</span>
                            <span className="text-sm text-gray-400 line-through font-medium">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-lg font-black text-black">${product.price}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";

export default async function HomePage() {
  await connectDB();

  const newArrival = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8);
  const topSelling = await Product.find({ isTopSelling: true }).limit(8);
  const featured = await Product.find({ isFeatured: true }).limit(4);
  const categories = await Product.distinct("category");

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* HERO SECTION - Fixed z-index */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-20 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Hatim Zone
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
            Elevate your lifestyle with our curated collection of premium goods. High quality, fair prices.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-black/20">
              Shop Collection
            </Link>
            <Link href="/new" className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.length > 0 ? categories.map((cat, i) => (
            <Link 
              href={`/shop?category=${cat}`} 
              key={i}
              className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:bg-gray-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:bg-gradient-to-br group-hover:from-black group-hover:to-gray-900 group-hover:text-white transition-all duration-500">
                🛍️
              </div>
              <span className="font-bold text-base uppercase tracking-wider text-gray-800">{cat}</span>
            </Link>
          )) : (
            <div className="col-span-full text-center text-gray-400 py-20">No categories found yet.</div>
          )}
        </div>
      </section>

      {/* FEATURED SECTION */}
      {featured.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                Must-Haves
              </h2>
              <p className="text-xl text-gray-600 font-medium">Our hand-picked featured collection</p>
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
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
            New Arrival
          </h2>
          <Link href="/shop" className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300">View All →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {newArrival.length > 0 ? newArrival.map((p) => (
            <ProductCard key={p._id} product={p} />
          )) : (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              <div className="text-6xl mb-4">✨</div>
              Check back soon for new arrivals!
            </div>
          )}
        </div>
      </section>

      {/* TOP SELLING */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              Top Selling
            </h2>
            <Link href="/shop" className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300">View All →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {topSelling.length > 0 ? topSelling.map((p) => (
              <ProductCard key={p._id} product={p} />
            )) : (
              <div className="col-span-full text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                Your best sellers will appear here.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard icon="💬" title="24/7 Live Chat" desc="Instant help anytime" />
          <FeatureCard icon="🚚" title="Express Shipping" desc="Fast delivery worldwide" />
          <FeatureCard icon="🔒" title="Secure Payment" desc="100% safe transactions" />
          <FeatureCard icon="⭐" title="Best Quality" desc="Premium guaranteed items" />
        </div>
      </section>
    </div>
  );
}

// Fixed ProductCard Component
function ProductCard({ product }) {
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:border-gray-200 flex flex-col h-full hover:-translate-y-2">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.images?.[0] || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={product.name}
          loading="lazy"
        />
        
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {product.isNewArrival && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            NEW
          </div>
        )}

        <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-black p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-white hover:scale-110">
          🛒
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{product.brand || 'Generic'}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{product.category}</span>
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-black text-black">৳{product.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through font-medium">৳{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-black">৳{product.price}</span>
            )}
          </div>
          <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
        </div>
      </div>
    </Link>
  );
}

// FeatureCard Component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 cursor-pointer">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <h3 className="font-black text-2xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-500">{title}</h3>
      <p className="text-gray-600 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
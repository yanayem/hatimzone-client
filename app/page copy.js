import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import {
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";

export default async function HomePage() {
  await connectDB();

  const newArrival = await Product.find({ isNewArrival: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const topSelling = await Product.find({ isTopSelling: true })
    .limit(4)
    .lean();

  const categories = await Product.distinct("category");

  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center">

        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2400&auto=format&fit=crop"
            alt="hero"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">

          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <HiOutlineSparkles className="text-yellow-300" />
              <span className="text-white text-xs font-semibold tracking-widest uppercase">
                Premium Collection 2026
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
              MODERN <br />
              LIVING STARTS <br />
              HERE.
            </h1>

            <p className="text-gray-200 text-lg mt-6 max-w-xl leading-relaxed">
              Discover premium products inspired by modern lifestyles.
              Designed with elegance, comfort, and timeless quality.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/shop"
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center gap-2"
              >
                Shop Now
                <HiArrowRight />
              </Link>

              <Link
                href="/shop"
                className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition"
              >
                Explore
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <FeatureCard
            icon={<HiOutlineTruck />}
            title="Free Shipping"
            desc="On orders over ৳5000"
          />

          <FeatureCard
            icon={<HiOutlineShieldCheck />}
            title="Secure Payment"
            desc="100% protected checkout"
          />

          <FeatureCard
            icon={<HiOutlineSparkles />}
            title="Premium Quality"
            desc="Best selected products"
          />

          <FeatureCard
            icon={<HiOutlineLightningBolt />}
            title="Fast Delivery"
            desc="Quick nationwide shipping"
          />

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Categories
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              Shop By Category
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-sm font-semibold text-gray-500 hover:text-black"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {categories.slice(0, 3).map((cat, i) => (
            <Link
              href={`/shop?category=${cat}`}
              key={i}
              className="group relative rounded-3xl overflow-hidden h-[350px]"
            >

              <div className="absolute inset-0 bg-gray-200">
                <img
                  src={`https://source.unsplash.com/800x800/?${cat}`}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs uppercase tracking-widest mb-2">
                  Explore
                </p>

                <h3 className="text-3xl font-black uppercase">
                  {cat}
                </h3>
              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-gray-50 py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-12">

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Latest Products
              </p>

              <h2 className="text-4xl font-black tracking-tight">
                New Arrivals
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-sm font-semibold text-gray-500 hover:text-black"
            >
              View All
            </Link>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {newArrival.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

          </div>

        </div>

      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex items-end justify-between mb-12">

          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Trending
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              Best Sellers
            </h2>
          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {topSelling.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="bg-black text-white py-28">

        <div className="max-w-3xl mx-auto text-center px-6">

          <h2 className="text-5xl font-black tracking-tight mb-6">
            Upgrade Your Lifestyle
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Join thousands of happy customers discovering premium modern products every day.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Shop Collection
            <HiArrowRight />
          </Link>

        </div>

      </section>

    </div>
  );
}

/* FEATURE CARD */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-4 hover:shadow-md transition">

      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-gray-900">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {desc}
        </p>
      </div>

    </div>
  );
}

/* PRODUCT CARD */
function ProductCard({ product }) {
  const hasDiscount = product.discountPrice > 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition duration-300"
    >

      {/* IMAGE */}
      <div className="aspect-square bg-gray-100 overflow-hidden">

        <img
          src={
            product.images?.[0] ||
            "https://placehold.co/600x600"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

      </div>

      {/* INFO */}
      <div className="p-5">

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {product.brand}
          </span>

          {product.isNewArrival && (
            <span className="text-[10px] bg-black text-white px-2 py-1 rounded-full uppercase">
              New
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-3 group-hover:text-black">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">

          <span className="text-lg font-bold text-black">
            ৳{hasDiscount ? product.discountPrice : product.price}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.price}
            </span>
          )}

        </div>

      </div>

    </Link>
  );
}
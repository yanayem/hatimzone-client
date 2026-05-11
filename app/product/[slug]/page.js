"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiPlus, HiMinus, HiHeart, HiOutlineHeart, HiShoppingCart, HiStar } from "react-icons/hi";
import { useCart } from "@/components/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [showDesc, setShowDesc] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ name: "", phone: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setRelated(data.related || []);
          setMainImage(p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image");
          if (p.variants?.length > 0) {
            setSelectedVariant(p.variants[0]);
          }

          // Fetch Reviews
          const revRes = await fetch(`/api/reviews?productId=${p._id}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData.success) {
              setReviews(revData.data);
            }
          }

          // Fetch Best Sellers
          const bestRes = await fetch(`/api/products?limit=4&isTopSelling=true`);
          if (bestRes.ok) {
            const bestData = await bestRes.json();
            if (bestData.success && bestData.data.length > 0) {
              setBestSellers(bestData.data.filter(item => item._id !== p._id));
            } else {
              // Fallback to latest products if no best sellers found
              const latestRes = await fetch(`/api/products?limit=4`);
              if (latestRes.ok) {
                const latestData = await latestRes.json();
                if (latestData.success) {
                  setBestSellers(latestData.data.filter(item => item._id !== p._id));
                }
              }
            }
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewData, productId: product._id }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setReviewData({ name: "", phone: "", rating: 5, comment: "" });
        alert("Review submitted!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-600 font-semibold">
        Product Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* MAIN PRODUCT CARD */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ================= LEFT GALLERY ================= */}
            <div className="p-4 md:p-8 lg:p-12 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="aspect-[4/5] bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden relative shadow-inner border border-gray-100 group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 md:p-10 transition duration-700 group-hover:scale-105"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 p-3 md:p-4 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  {isInWishlist(product._id) ? (
                    <HiHeart className="text-red-500 text-xl md:text-2xl" />
                  ) : (
                    <HiOutlineHeart className="text-gray-400 text-xl md:text-2xl" />
                  )}
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 overflow-x-auto pb-2 no-scrollbar">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${mainImage === img ? "border-black shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="p-6 md:p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="bg-blue-50 text-blue-600 px-3 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{product.brand}</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-4 md:mb-6">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="flex items-center gap-4 bg-gray-50 w-fit px-5 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl">
                  <p className="text-2xl md:text-3xl font-black text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* VARIANTS */}
              {product.variants?.length > 0 && (
                <div className="mb-8 md:mb-10">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 md:mb-4 ml-1">Selection Options</p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border-2 font-bold text-xs md:text-sm transition-all ${selectedVariant === v
                            ? "bg-black text-white border-black shadow-xl scale-105"
                            : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                          }`}
                      >
                        {v.size || v.color || v.material}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="space-y-4">
                {/* QUANTITY */}
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 bg-gray-50 w-fit p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-gray-100">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg md:rounded-xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-black text-lg md:text-xl w-6 md:w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg md:rounded-xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiPlus />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-white border-2 border-black text-black py-3 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-50 transition shadow-sm text-[10px] md:text-xs"
                  >
                    <HiShoppingCart className="text-lg" />
                    Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-black text-white py-3 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl text-[10px] md:text-xs"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* WARRANTY & SPECS */}
              <div className="mt-8 md:mt-12 space-y-4 md:space-y-6 pt-8 md:pt-10 border-t border-gray-100">
                {product.warranty && (
                  <div className="flex items-center gap-4 bg-green-50/50 p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-green-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-lg shadow-lg shadow-green-100">🛡️</div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-green-600 uppercase tracking-widest">Authorized Warranty</p>
                      <p className="text-sm md:text-md font-black text-gray-900">{product.warranty}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8">
                  <h3 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 md:mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-8">
                    {product.material && (
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Material</p>
                        <p className="text-xs md:text-sm font-black text-gray-900">{product.material}</p>
                      </div>
                    )}
                    {product.color && (
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Color</p>
                        <p className="text-xs md:text-sm font-black text-gray-900">{product.color}</p>
                      </div>
                    )}
                    {product.powerSource && (
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Power Source</p>
                        <p className="text-xs md:text-sm font-black text-gray-900">{product.powerSource}</p>
                      </div>
                    )}
                    {product.wattage && (
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Wattage</p>
                        <p className="text-xs md:text-sm font-black text-gray-900">{product.wattage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION TAB */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 md:mb-6">Product Information</h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed italic">
            "{product.description}"
          </p>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16 px-4 md:px-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Customer Stories</h2>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Verified feedback from our community</p>
            </div>
            <button
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:scale-105 transition shadow-2xl w-fit"
            >
              Write Review
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-8 md:space-y-10">
              {reviews.length > 0 ? reviews.map((rev, i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-4 md:gap-5 mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-gray-400 shadow-inner">
                      {rev.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-base md:text-lg">{rev.user.name}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-400 text-[10px]">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < rev.rating ? "fill-current" : "text-gray-200"} />
                          ))}
                        </div>
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium text-base md:text-lg">
                    {rev.comment}
                  </p>
                </div>
              )) : (
                <div className="text-center py-16 md:py-20 bg-white rounded-2xl md:rounded-[3rem] border-2 border-dashed border-gray-100 px-4">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Be the first to review this light</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <div id="review-form" className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[3rem] lg:sticky lg:top-24 border border-gray-100 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8 uppercase tracking-tighter">Post Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      required
                      placeholder="Your Name"
                      className="store-input"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Phone Number"
                      className="store-input"
                      value={reviewData.phone}
                      onChange={(e) => setReviewData({ ...reviewData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 md:mb-4 ml-2">Rating Experience</label>
                    <div className="flex gap-2 md:gap-3">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: num })}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${reviewData.rating >= num ? "bg-amber-400 text-white shadow-lg" : "bg-gray-50 text-gray-300"
                            }`}
                        >
                          <HiStar className="text-xl md:text-2xl" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows="4"
                    placeholder="Describe your experience..."
                    className="store-input resize-none"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  />

                  <button
                    disabled={submitting}
                    className="w-full bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl disabled:bg-gray-400 text-xs md:text-sm"
                  >
                    {submitting ? "Submitting..." : "Publish Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-40 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 md:mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Other Beautiful Lamps</h2>
                <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Other lights you might love</p>
              </div>
              <Link href="/shop" className="text-[10px] md:text-xs font-black text-blue-600 hover:underline uppercase tracking-widest w-fit">View Collection</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p) => (
                <div key={p._id} className="store-card group flex flex-col">
                  <Link href={`/product/${p.slug || p._id}`} className="block relative aspect-square bg-gray-50 overflow-hidden m-2 rounded-2xl">
                    <img
                      src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1 pt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{p.brand}</span>
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-black transition text-lg mb-4">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-lg font-black text-gray-900">
                        ৳{p.discountPrice || p.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(p, 1);
                          alert("Added to cart!");
                        }}
                        className="text-[10px] bg-black text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-gray-800 transition"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BEST SELLERS ================= */}
        {bestSellers.length > 0 && (
          <div className="mt-32 pt-32 border-t border-gray-100">
            <div className="flex items-center justify-between mb-12 px-6">
              <div>
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Most Popular</h2>
                <p className="text-gray-500 font-medium mt-2">What our customers are buying right now</p>
              </div>
              <Link href="/shop?sort=popular" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Shop Trending</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {bestSellers.map((p) => (
                <div key={p._id} className="store-card group flex flex-col">
                  <Link href={`/product/${p.slug || p._id}`} className="block relative aspect-square bg-gray-50 overflow-hidden m-2 rounded-2xl">
                    <img
                      src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1 pt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{p.brand}</span>
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-black transition text-lg mb-4">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-lg font-black text-gray-900">
                        ৳{p.discountPrice || p.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(p, 1);
                          alert("Added to cart!");
                        }}
                        className="text-[10px] bg-blue-600 text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
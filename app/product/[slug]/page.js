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
          setMainImage(p.images?.[0] || "");
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
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-32">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* MAIN PRODUCT CARD */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">

            {/* ================= LEFT GALLERY ================= */}
            <div className="p-8 lg:p-12 bg-gray-50/50 border-r border-gray-100">
              <div className="aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden relative shadow-inner border border-gray-100 group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-10 transition duration-700 group-hover:scale-105"
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  {isInWishlist(product._id) ? (
                    <HiHeart className="text-red-500 text-2xl" />
                  ) : (
                    <HiOutlineHeart className="text-gray-400 text-2xl" />
                  )}
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-4 mt-8 overflow-x-auto pb-2">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      mainImage === img ? "border-black shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{product.brand}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="flex items-center gap-4 bg-gray-50 w-fit px-6 py-3 rounded-2xl">
                  <p className="text-3xl font-black text-gray-900">
                    ৳{product.discountPrice || product.price}
                  </p>
                  {product.discountPrice && (
                    <p className="text-lg text-gray-400 line-through font-medium">
                      ৳{product.price}
                    </p>
                  )}
                </div>
              </div>

              {/* VARIANTS */}
              {product.variants?.length > 0 && (
                <div className="mb-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Selection Options</p>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                          selectedVariant === v
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
                <div className="flex items-center gap-6 mb-8 bg-gray-50 w-fit p-2 rounded-2xl border border-gray-100">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-black text-xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiPlus />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-white border-2 border-black text-black py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
                  >
                    <HiShoppingCart className="text-xl" />
                    Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-black text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* WARRANTY & SPECS */}
              <div className="mt-12 space-y-6 pt-10 border-t border-gray-100">
                {product.warranty && (
                  <div className="flex items-center gap-4 bg-green-50/50 p-5 rounded-[2rem] border border-green-100">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-100">🛡️</div>
                    <div>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Authorized Warranty</p>
                      <p className="text-md font-black text-gray-900">{product.warranty}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-[2.5rem] p-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    {product.material && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Material</p>
                        <p className="text-sm font-black text-gray-900">{product.material}</p>
                      </div>
                    )}
                    {product.color && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Color</p>
                        <p className="text-sm font-black text-gray-900">{product.color}</p>
                      </div>
                    )}
                    {product.powerSource && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Power Source</p>
                        <p className="text-sm font-black text-gray-900">{product.powerSource}</p>
                      </div>
                    )}
                    {product.wattage && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Wattage</p>
                        <p className="text-sm font-black text-gray-900">{product.wattage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION TAB */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Product Information</h2>
            <p className="text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed italic">
              "{product.description}"
            </p>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="mt-32">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 px-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Customer Voice</h2>
              <p className="text-gray-500 font-medium mt-2">Verified feedback from our community</p>
            </div>
            <button 
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition shadow-2xl"
            >
              Write Review
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-16">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-10">
              {reviews.length > 0 ? reviews.map((rev, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400 shadow-inner">
                      {rev.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{rev.user.name}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < rev.rating ? "fill-current" : "text-gray-200"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium text-lg">
                    {rev.comment}
                  </p>
                </div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Be the first to review this piece</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <div id="review-form" className="bg-white p-10 rounded-[3rem] sticky top-24 border border-gray-100 shadow-2xl">
                <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Post Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      required
                      placeholder="Your Name"
                      className="store-input"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                    />
                    <input 
                      required
                      placeholder="Phone Number"
                      className="store-input"
                      value={reviewData.phone}
                      onChange={(e) => setReviewData({...reviewData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Rating Experience</label>
                    <div className="flex gap-3">
                      {[1,2,3,4,5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: num})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            reviewData.rating >= num ? "bg-amber-400 text-white shadow-lg" : "bg-gray-50 text-gray-300"
                          }`}
                        >
                          <HiStar className="text-2xl" />
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
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  />

                  <button 
                    disabled={submitting}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl disabled:bg-gray-400"
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
          <div className="mt-40">
            <div className="flex items-center justify-between mb-12 px-6">
              <div>
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">You May Also Like</h2>
                <p className="text-gray-500 font-medium mt-2">Perfect matches for this piece</p>
              </div>
              <Link href="/shop" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">View Collection</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((p) => (
                <div key={p._id} className="store-card group flex flex-col">
                  <Link href={`/product/${p.slug || p._id}`} className="block relative aspect-square bg-gray-50 overflow-hidden m-2 rounded-2xl">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-full object-contain p-6 transition duration-700 group-hover:scale-110"
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
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-full object-contain p-6 transition duration-700 group-hover:scale-110"
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
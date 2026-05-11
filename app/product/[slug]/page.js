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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setMainImage(data.data.images[0]);
          if (data.data.variants?.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          }
          
          // Fetch Related
          const relRes = await fetch(`/api/products?category=${data.data.category}&limit=4`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelated(relData.data.filter(p => p._id !== data.data._id));
          }

          // Fetch Reviews
          const revRes = await fetch(`/api/reviews?productId=${data.data._id}`);
          const revData = await revRes.json();
          if (revData.success) {
            setReviews(revData.data);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* MAIN CARD */}
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-sm">

          {/* ================= LEFT IMAGE ================= */}
          <div className="space-y-4">

            <div className="aspect-square bg-white border rounded-xl overflow-hidden relative group">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition"
              >
                {isInWishlist(product._id) ? (
                  <HiHeart className="text-red-500 text-xl" />
                ) : (
                  <HiOutlineHeart className="text-gray-400 text-xl" />
                )}
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-md overflow-hidden border ${
                    mainImage === img ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT INFO ================= */}
          <div className="flex flex-col">

            <p className="text-sm text-blue-600 font-semibold uppercase">
              {product.brand}
            </p>

            <h1 className="text-3xl font-bold mt-1">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-center gap-3 mt-4">
              <p className="text-2xl font-bold">
                ৳{product.discountPrice || product.price}
              </p>

              {product.discountPrice && (
                <p className="text-gray-400 line-through">
                  ৳{product.price}
                </p>
              )}
            </div>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-2">Options</p>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        selectedVariant === v
                          ? "bg-black text-white"
                          : "bg-white"
                      }`}
                    >
                      {v.size || v.color || v.material}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION TOGGLE */}
            <div className="mt-6">
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="text-sm text-blue-600 font-semibold"
              >
                {showDesc ? "Hide Description" : "See Full Description"}
              </button>

              {showDesc && (
                <p className="mt-3 text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {product.description}
                </p>
              )}
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 border rounded"
              >
                <HiMinus />
              </button>

              <span className="font-bold">{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 border rounded"
              >
                <HiPlus />
              </button>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="border py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <HiShoppingCart />
                Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-black text-white py-3 rounded-lg font-bold"
              >
                Buy Now
              </button>
            </div>

        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-gray-50 pb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Customer Reviews</h2>
              <p className="text-gray-500 font-medium mt-1">Real feedback from real customers</p>
            </div>
            <button 
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition text-sm uppercase tracking-widest shadow-xl"
            >
              Write a Review
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-8">
              {reviews.length > 0 ? reviews.map((rev, i) => (
                <div key={i} className="group border-b border-gray-50 pb-8 last:border-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-black text-gray-400">
                      {rev.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{rev.user.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < rev.rating ? "fill-current" : "text-gray-200"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {rev.comment}
                  </p>
                </div>
              )) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <div id="review-form" className="bg-gray-50 p-8 rounded-3xl sticky top-24 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Submit Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required
                      placeholder="Your Name"
                      className="w-full bg-white px-5 py-3 rounded-xl border border-gray-200 focus:border-black outline-none font-bold text-sm transition"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                    />
                    <input 
                      required
                      placeholder="Phone Number"
                      className="w-full bg-white px-5 py-3 rounded-xl border border-gray-200 focus:border-black outline-none font-bold text-sm transition"
                      value={reviewData.phone}
                      onChange={(e) => setReviewData({...reviewData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: num})}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                            reviewData.rating >= num ? "bg-amber-400 text-white" : "bg-white text-gray-300 border border-gray-100"
                          }`}
                        >
                          <HiStar className="text-xl" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    required
                    rows="4"
                    placeholder="Tell us about your experience..."
                    className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-200 focus:border-black outline-none font-medium text-sm transition"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  />

                  <button 
                    disabled={submitting}
                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl disabled:bg-gray-400"
                  >
                    {submitting ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">You May Also Like</h2>
                <p className="text-gray-500 font-medium mt-1">Recommended products from this collection</p>
              </div>
              <Link href="/shop" className="text-sm font-black text-blue-600 hover:underline uppercase tracking-widest">View All</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-full object-contain transition duration-500 group-hover:scale-110 p-4"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{p.brand}</p>
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition h-5">
                      {p.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-black text-gray-900">
                          ৳{p.discountPrice || p.price}
                        </p>
                        {p.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ৳{p.price}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] bg-gray-50 px-2 py-1 rounded-md font-black text-gray-400 uppercase">View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
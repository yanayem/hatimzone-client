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

  const [showVideo, setShowVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Auto-slide logic
  useEffect(() => {
    let interval;
    if (product && !showVideo) {
      const images = [product.cover, ...(product.images || [])].filter(Boolean);
      if (images.length > 1) {
        interval = setInterval(() => {
          setActiveSlide((prev) => (prev + 1) % images.length);
        }, 4000);
      }
    }
    return () => clearInterval(interval);
  }, [product, showVideo]);

  const nextSlide = () => {
    const images = [product?.cover, ...(product?.images || [])].filter(Boolean);
    setActiveSlide((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const images = [product?.cover, ...(product?.images || [])].filter(Boolean);
    setActiveSlide((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

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
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* MAIN PRODUCT CARD */}
        <div className="bg-white rounded-3xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ================= LEFT GALLERY ================= */}
            <div className="p-4 md:p-8 lg:p-12 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div 
                className="aspect-[4/5] bg-white rounded-3xl md:rounded-3xl overflow-hidden relative shadow-inner border border-gray-100 group"
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                onTouchEnd={() => {
                  if (touchStart - touchEnd > 70) nextSlide();
                  if (touchStart - touchEnd < -70) prevSlide();
                }}
              >
                {showVideo ? (
                  <div className="w-full h-full relative">
                    <iframe
                      src={product.videoUrl?.includes("youtube.com") || product.videoUrl?.includes("youtu.be")
                        ? `https://www.youtube.com/embed/${product.videoUrl.split("/").pop()}?autoplay=1`
                        : product.videoUrl
                      }
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition"
                    >
                      Back to Photos
                    </button>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const images = [product.cover, ...(product.images || [])].filter(Boolean);
                      if (images.length === 0) images.push("https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image");
                      return (
                        <div className="flex h-full w-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                          {images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              className="w-full h-full object-contain p-6 md:p-10 flex-shrink-0"
                              alt={`${product.name} ${idx + 1}`}
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 overflow-x-auto pb-2 no-scrollbar">
                {(() => {
                  const images = [product.cover, ...(product.images || [])].filter(Boolean);
                  return images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSlide(i);
                        setShowVideo(false);
                      }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl md:rounded-3xl overflow-hidden flex-shrink-0 border-2 transition-all ${!showVideo && activeSlide === i ? "border-black shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ));
                })()}

                {/* VIDEO THUMBNAIL */}
                {product.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl md:rounded-3xl flex-shrink-0 border-2 transition-all bg-black flex flex-col items-center justify-center gap-1 ${showVideo ? "border-green-600 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                    <span className="text-[12px] font-black text-white uppercase tracking-widest">Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="p-6 md:p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="bg-green-50 text-green-600 px-3 md:px-4 py-1 rounded-full text-[12px] md:text-xs font-black uppercase tracking-widest">{product.brand}</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-4 md:mb-6">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="flex items-center gap-4 bg-gray-50 w-fit px-5 md:px-6 py-2 md:py-3 rounded-3xl md:rounded-3xl">
                  <p className="text-2xl md:text-3xl font-black text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* VARIANTS (Commented out)
              {product.variants?.length > 0 && (
                <div className="mb-8 md:mb-10">
                  ...
                </div>
              )}
              */}

              {/* ACTIONS */}
              <div className="space-y-4">
                {/* QUANTITY */}
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 bg-gray-50 w-fit p-1.5 md:p-2 rounded-3xl md:rounded-3xl border border-gray-100">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg md:rounded-3xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-black text-lg md:text-xl w-6 md:w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg md:rounded-3xl shadow-sm hover:bg-gray-100 transition"
                  >
                    <HiPlus />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-white border-2 border-black text-black py-3 md:py-5 rounded-3xl md:rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-50 transition shadow-sm text-[12px] md:text-xs"
                  >
                    <HiShoppingCart className="text-lg" />
                    Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-black text-white py-3 md:py-5 rounded-3xl md:rounded-3xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl text-[12px] md:text-xs"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* WARRANTY & SPECS */}
              <div className="mt-8 md:mt-12 space-y-4 md:space-y-6 pt-8 md:pt-10 border-t border-gray-100">
                {product.warranty && (
                  <div className="flex items-center gap-4 bg-green-50/50 p-4 md:p-5 rounded-3xl md:rounded-3xl border border-green-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 text-white rounded-3xl md:rounded-3xl flex items-center justify-center text-lg shadow-lg shadow-green-100">🛡️</div>
                    <div>
                      <p className="text-[12px] md:text-xs font-black text-green-600 uppercase tracking-widest">Authorized Warranty</p>
                      <p className="text-sm md:text-md font-black text-gray-900">{product.warranty}</p>
                    </div>
                  </div>
                )}

                {/* TECHNICAL SPECS (Commented out)
                <div className="bg-gray-50 rounded-3xl md:rounded-3xl p-6 md:p-8">
                  ...
                </div>
                */}
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION TAB */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-xs md:text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-4 md:mb-6">Product Information</h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed italic">
            "{product.description}"
          </p>
        </div>

        {/* ================= REVIEWS SECTION (Commented out) =================
        <div className="mt-24 md:mt-32">
          ...
        </div>
        */}

        {/* ================= RELATED PRODUCTS ================= */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-40 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 md:mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Other Beautiful Lamps</h2>
                <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Other lights you might love</p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p) => (
                <div key={p._id} className="store-card group flex flex-col">
                  <Link href={`/product/${p.slug || p._id}`} className="block relative aspect-square bg-gray-50 overflow-hidden m-2 rounded-3xl">
                    <img
                      src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1 pt-2">
                    <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">{p.brand}</span>
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
                        className="text-[11px] bg-black text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-gray-800 transition"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 flex justify-center">
              <Link
                href="/shop"
                className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] md:text-xs hover:bg-gray-800 hover:scale-105 transition-all shadow-xl"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        )}

        {/* ================= BEST SELLERS (Commented out) =================
        {bestSellers.length > 0 && (
          ...
        )}
        */}

      </div>
    </div>
  );
}
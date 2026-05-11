"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  HiOutlineShieldCheck, 
  HiOutlineTruck, 
  HiOutlineClock, 
  HiStar, 
  HiPlus, 
  HiMinus, 
  HiChevronDown,
  HiOutlineShoppingBag,
  HiLightningBolt,
  HiX
} from "react-icons/hi";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Modal States
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [orderData, setOrderData] = useState({ name: "", phone: "", address: "" });
    const [reviewData, setReviewData] = useState({ userName: "", rating: 5, comment: "" });
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/product/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                    setRelated(data.related || []);
                    setMainImage(data.product.images?.[0] || "");
                }
            } catch (err) {
                console.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product._id,
                    quantity,
                    variant: selectedVariant,
                    customer: orderData
                })
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: "success", text: data.message });
                setTimeout(() => {
                    setShowOrderModal(false);
                    setMsg({ type: "", text: "" });
                    setOrderData({ name: "", phone: "", address: "" });
                }, 3000);
            } else {
                setMsg({ type: "error", text: data.message });
            }
        } catch (err) {
            setMsg({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/product/${slug}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData)
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: "success", text: "Review submitted! Reloading..." });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMsg({ type: "error", text: data.message });
            }
        } catch (err) {
            setMsg({ type: "error", text: "Error submitting review." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
            Product Not Found
        </div>
    );

    const discountPercentage = product.discountPrice > 0 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
        : 0;

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                
                {/* BREADCRUMB */}
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">
                    <Link href="/" className="hover:text-black">Home</Link> 
                    <span>/</span> 
                    <Link href={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link> 
                    <span>/</span> 
                    <span className="text-black">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* LEFT: MEDIA */}
                    <div className="space-y-6 sticky top-24">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 group relative shadow-2xl">
                            {discountPercentage > 0 && (
                                <div className="absolute top-6 left-6 bg-pink-600 text-white px-4 py-2 rounded-2xl text-xs font-black z-10 shadow-xl">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                            <img 
                                src={mainImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {product.images?.map((img, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-pink-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: INFO */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-gray-500">{product.brand}</span>
                                {product.stockQuantity > 0 ? (
                                    <span className="text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> In Stock
                                    </span>
                                ) : (
                                    <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                                )}
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-orange-400">
                                    {[...Array(5)].map((_, i) => <HiStar key={i} className={i < Math.round(product.averageRating) ? 'fill-current' : 'text-gray-200'} />)}
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">({product.totalReviews} REVIEWS)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-black">৳{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
                            {product.discountPrice > 0 && (
                                <span className="text-xl text-gray-300 line-through font-bold">৳{product.price}</span>
                            )}
                        </div>

                        <p className="text-gray-500 leading-relaxed font-medium text-lg">
                            {product.description}
                        </p>

                        {/* VARIANTS */}
                        {product.variants?.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Available Options</h4>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-6 py-4 rounded-2xl border-2 transition-all flex flex-col items-start ${selectedVariant === v ? 'border-pink-600 bg-pink-50 text-pink-600 shadow-md' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">{v.size || v.color || v.material}</span>
                                            {v.additionalPrice > 0 && <span className={`text-[10px] font-bold ${selectedVariant === v ? 'text-pink-400' : 'text-green-600'}`}>+৳{v.additionalPrice}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ORDER ACTIONS */}
                        <div className="space-y-4 pt-6">
                            <div className="flex gap-4">
                                <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100 h-16">
                                    <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition text-xl"><HiMinus /></button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity+1)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition text-xl"><HiPlus /></button>
                                </div>
                                
                                <button className="flex-1 bg-white text-black border-2 border-black rounded-3xl font-black uppercase tracking-[0.1em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 group">
                                    <HiOutlineShoppingBag className="text-xl group-hover:scale-110 transition" />
                                    Add to Bag
                                </button>
                            </div>

                            {/* ORDER NOW BUTTON */}
                            <button 
                                onClick={() => setShowOrderModal(true)}
                                className="w-full bg-pink-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-pink-700 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <HiLightningBolt className="text-2xl animate-pulse" />
                                ORDER NOW
                            </button>
                        </div>

                        {/* TRUST BADGES */}
                        <div className="grid grid-cols-3 gap-4 pt-10">
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-gray-200 transition">
                                <HiOutlineShieldCheck className="w-8 h-8 mb-2 text-pink-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{product.warranty}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-gray-200 transition">
                                <HiOutlineTruck className="w-8 h-8 mb-2 text-pink-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Dhaka: ৳{product.deliveryCost?.insideDhaka}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-gray-200 transition">
                                <HiOutlineClock className="w-8 h-8 mb-2 text-pink-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">7 Days Return</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {related.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">You May Also Like</h2>
                                <p className="text-gray-400 font-medium">Complementary pieces for your space</p>
                            </div>
                            <Link href="/shop" className="text-sm font-black uppercase tracking-widest hover:text-pink-600 transition underline underline-offset-8">View Collection</Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            {related.map((p) => (
                                <Link href={`/product/${p.slug}`} key={p._id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                        <img 
                                            src={p.images?.[0]} 
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                        {p.discountPrice > 0 && (
                                            <div className="absolute top-4 left-4 bg-pink-600 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                                                SAVE {Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{p.brand}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-4 line-clamp-2 leading-tight group-hover:text-pink-600 transition">{p.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-black">৳{p.discountPrice > 0 ? p.discountPrice : p.price}</span>
                                                {p.discountPrice > 0 && <span className="text-[10px] text-gray-400 line-through">৳{p.price}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* REVIEWS SECTION */}
                <div className="mt-32 pt-20 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Customer Stories</h2>
                            <p className="text-gray-400 font-medium">Real experiences from our premium community</p>
                        </div>
                        <button 
                            onClick={() => setShowReviewModal(true)}
                            className="bg-gray-50 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition"
                        >
                            Write A Review
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {product.reviews?.length > 0 ? product.reviews.map((rev, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4">
                                <div className="flex text-orange-400 text-xs">
                                    {[...Array(5)].map((_, j) => <HiStar key={j} className={j < rev.rating ? 'fill-current' : 'text-gray-200'} />)}
                                </div>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed">"{rev.comment}"</p>
                                <div className="pt-4 border-t border-gray-200/50 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{rev.userName}</span>
                                </div>
                            </div>
                        )) : (
                          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">
                            No reviews yet. Be the first!
                          </div>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK ORDER MODAL */}
            {showOrderModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrderModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button onClick={() => setShowOrderModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"><HiX /></button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Quick Order</h2>
                        <p className="text-gray-400 text-sm mb-8">Fill in your details and we'll handle the rest.</p>
                        
                        {msg.text && (
                            <div className={`p-4 rounded-2xl mb-6 text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                            <input 
                                required
                                type="text" 
                                placeholder="Full Name" 
                                value={orderData.name}
                                onChange={e => setOrderData({...orderData, name: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-300 transition"
                            />
                            <input 
                                required
                                type="tel" 
                                placeholder="Phone Number" 
                                value={orderData.phone}
                                onChange={e => setOrderData({...orderData, phone: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-300 transition"
                            />
                            <textarea 
                                required
                                placeholder="Delivery Address" 
                                rows="3"
                                value={orderData.address}
                                onChange={e => setOrderData({...orderData, address: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-300 transition"
                            ></textarea>
                            <button 
                                disabled={submitting}
                                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {submitting ? "Placing Order..." : "Confirm Order"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* REVIEW MODAL */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"><HiX /></button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Write Review</h2>
                        
                        {msg.text && (
                            <div className={`p-4 rounded-2xl mb-6 text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-4 mt-6">
                            <input 
                                required
                                type="text" 
                                placeholder="Your Name" 
                                value={reviewData.userName}
                                onChange={e => setReviewData({...reviewData, userName: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-300 transition"
                            />
                            <div className="flex gap-2 items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase mr-2">Rating:</span>
                                {[1,2,3,4,5].map(num => (
                                    <button 
                                        type="button"
                                        key={num}
                                        onClick={() => setReviewData({...reviewData, rating: num})}
                                        className={`text-2xl transition ${reviewData.rating >= num ? 'text-orange-400' : 'text-gray-200'}`}
                                    >
                                        <HiStar className="fill-current" />
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                required
                                placeholder="Your experience..." 
                                rows="4"
                                value={reviewData.comment}
                                onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-300 transition"
                            ></textarea>
                            <button 
                                disabled={submitting}
                                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Post Review"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

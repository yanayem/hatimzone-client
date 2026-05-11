"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineClock, HiStar, HiPlus, HiMinus } from "react-icons/hi";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                    setMainImage(data.product.images[0]);
                }
            } catch (err) {
                console.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
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
                    <span>Home</span> / <span>{product.category}</span> / <span className="text-black">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* LEFT: MEDIA */}
                    <div className="space-y-6 sticky top-10">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 group relative">
                            {discountPercentage > 0 && (
                                <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 rounded-2xl text-xs font-black z-10 shadow-xl">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                            <img 
                                src={mainImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {product.images.map((img, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-black scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
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

                        <p className="text-gray-500 leading-relaxed font-medium">
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
                                            className={`px-6 py-4 rounded-2xl border-2 transition-all flex flex-col items-start ${selectedVariant === v ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 hover:border-gray-300'}`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">{v.size || v.color || v.material}</span>
                                            {v.additionalPrice > 0 && <span className={`text-[10px] font-bold ${selectedVariant === v ? 'text-gray-400' : 'text-green-600'}`}>+৳{v.additionalPrice}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ADD TO CART SECTION */}
                        <div className="flex gap-4 pt-6">
                            <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                                <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition"><HiMinus /></button>
                                <span className="w-12 text-center font-black">{quantity}</span>
                                <button onClick={() => setQuantity(quantity+1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition"><HiPlus /></button>
                            </div>
                            <button className="flex-1 bg-black text-white rounded-3xl font-black uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200">
                                Add to Shopping Bag
                            </button>
                        </div>

                        {/* TRUST BADGES */}
                        <div className="grid grid-cols-3 gap-4 pt-10">
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-[2rem]">
                                <HiOutlineShieldCheck className="w-6 h-6 mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{product.warranty}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-[2rem]">
                                <HiOutlineTruck className="w-6 h-6 mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Dhaka: ৳{product.deliveryCost.insideDhaka}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-[2rem]">
                                <HiOutlineClock className="w-6 h-6 mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">7 Days Return</span>
                            </div>
                        </div>

                        {/* TABS / COLLAPSIBLES */}
                        <div className="space-y-4 pt-10 border-t border-gray-100">
                            <details className="group" open>
                                <summary className="flex justify-between items-center font-black uppercase tracking-widest text-xs cursor-pointer list-none py-4 border-b border-gray-50">
                                    Product Specifications <HiChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="py-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</div>
                                        <div className="text-sm font-bold text-gray-900">{product.material}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bulb Type</div>
                                        <div className="text-sm font-bold text-gray-900">{product.bulbType}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dimensions</div>
                                        <div className="text-sm font-bold text-gray-900">{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}</div>
                                        {Object.entries(product.specifications).map(([key, val]) => (
                                            <React.Fragment key={key}>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</div>
                                                <div className="text-sm font-bold text-gray-900">{val}</div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </details>

                            {product.usageInstructions?.length > 0 && (
                                <details className="group">
                                    <summary className="flex justify-between items-center font-black uppercase tracking-widest text-xs cursor-pointer list-none py-4 border-b border-gray-50">
                                        Usage Instructions <HiChevronDown className="group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="py-6 space-y-4">
                                        {product.usageInstructions.map((inst, i) => (
                                            <div key={i} className="flex gap-4">
                                                <span className="font-black text-gray-200 text-2xl">0{i+1}</span>
                                                <p className="text-sm text-gray-600 font-medium leading-relaxed pt-2">{inst}</p>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </div>

                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-32 pt-20 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Customer Stories</h2>
                            <p className="text-gray-400 font-medium">Real experiences from our premium community</p>
                        </div>
                        <button className="bg-gray-50 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition">Write A Review</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {product.reviews.map((rev, i) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function HiChevronDown(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><path fillRule="evenodd" d="M5.293 7.293a1.1 1.1 0 011.414 0L10 10.586l3.293-3.293a1.1 1.1 0 111.414 1.414l-4 4a1.1 1.1 0 01-1.414 0l-4-4a1.1 1.1 0 010-1.414z" clipRule="evenodd"></path></svg>
}

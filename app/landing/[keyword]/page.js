"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiOutlineShoppingBag, HiOutlinePhone, HiOutlineLocationMarker, HiCheckCircle, HiArrowRight, HiOutlineSparkles } from "react-icons/hi";
import { useRouter, useParams } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";

export default function DynamicLandingPage() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [orderLoading, setOrderLoading] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [showSuccess, setShowSuccess] = useState(false);
   const [lastOrderId, setLastOrderId] = useState("");

   const [settings, setSettings] = useState({
      shippingInsideDhaka: 70,
      shippingOutsideDhaka: 130,
      contactNumber: "01700-000000"
   });

   const [customer, setCustomer] = useState({
      name: "",
      phone: "",
      address: "",
      city: "Dhaka"
   });

   const formRef = useRef(null);
   const router = useRouter();
   const params = useParams();
   const keyword = params?.keyword;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const url = keyword ? `/api/landing?keyword=${encodeURIComponent(keyword)}` : "/api/landing";
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
               const { products, settings } = data.data;
               setProducts(products || []);
               if (products?.length > 0) {
                  setSelectedProduct(products[0]);
               }
               if (settings) {
                  setSettings(settings);
               }
            }
         } catch (err) {
            console.error("Failed to fetch landing data");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [keyword]);

   const scrollToForm = (product) => {
      if (product) setSelectedProduct(product);
      formRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   const handleOrder = async (e) => {
      e.preventDefault();
      if (!selectedProduct) return alert("দয়া করে একটি পণ্য সিলেক্ট করুন");
      if (!customer.name || !customer.phone || !customer.address) return alert("দয়া করে সব তথ্য পূরণ করুন");

      setOrderLoading(true);
      try {
         const shippingCost = Number(customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka);
         const currentPrice = Number(selectedProduct.discountPrice > 0 ? selectedProduct.discountPrice : selectedProduct.price);
         
         const orderData = {
            items: [{
               product: selectedProduct._id,
               name: selectedProduct.name,
               price: currentPrice,
               quantity: 1,
               image: selectedProduct.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"
            }],
            customer,
            subTotal: currentPrice,
            shippingCost: shippingCost,
            totalPrice: currentPrice + shippingCost,
            paymentMethod: "Cash on Delivery",
            notes: `Landing Page Order (${keyword || 'Direct'})`
         };

         const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
         });

         const data = await res.json();
         if (data.success) {
            localStorage.setItem("userPhone", customer.phone);
            setLastOrderId(data.data.orderId);
            setShowSuccess(true);
         } else {
            alert(data.message || "অর্ডার সম্পন্ন করা যায়নি");
         }
      } catch (err) {
         alert("সার্ভার সমস্যা, আবার চেষ্টা করুন");
      } finally {
         setOrderLoading(false);
      }
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-white">
         <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
   );

   return (
      <div className="bg-[#ffffff] min-h-screen text-gray-900 selection:bg-blue-100 pb-20 md:pb-32">

         {/* HERO SECTION - PREMIUM BOUTIQUE STYLE */}
         <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img
                  src="/imgq.jpg"
                  alt="Exclusive Lamp"
                  className="w-full h-full object-cover scale-105 animate-slow-zoom"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
            </div>
            
            <div className="relative z-10 text-center px-6 max-w-5xl">
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                  <HiOutlineSparkles className="text-blue-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">প্রিমিয়াম কালেকশন</span>
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                  আলোকিত করুন <br />
                  <span className="text-blue-400 italic font-serif normal-case tracking-normal">আপনার পৃথিবী</span>
               </h1>
               <p className="text-sm md:text-xl text-white/90 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                  হাতে তৈরি অসাধারণ সব ল্যাম্পের কালেকশন থেকে আপনার পছন্দেরটি বেছে নিন। প্রতিটি পণ্য আমাদের নিজস্ব কারখানায় নিপুণভাবে তৈরি।
               </p>
               <button 
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95"
               >
                  অর্ডার করুন <HiArrowRight className="inline-block ml-2" />
               </button>
            </div>
         </section>

         {/* PRODUCT GRID SECTION */}
         <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="text-center mb-16 md:mb-24">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                  {keyword ? `${decodeURIComponent(keyword)} কালেকশন` : "আমাদের কালেকশন"}
               </h2>
               <div className="w-20 h-1.5 bg-black mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
               {products.length > 0 ? products.map((p) => (
                  <div key={p._id} className="store-card group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                     <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                        <img
                           src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           alt={p.name}
                        />
                        {p.discountPrice > 0 && (
                           <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                              সেল
                           </div>
                        )}
                     </div>
                     <div className="p-6 md:p-8 flex flex-col flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{p.brand || "প্রিমিয়াম ব্র্যান্ড"}</p>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 mb-6 h-14 leading-tight group-hover:text-blue-600 transition-colors">{p.name}</h3>

                        <div className="mt-auto">
                           <div className="flex items-center gap-3 mb-6">
                              <span className="text-2xl font-black text-gray-900">৳{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</span>
                              {p.discountPrice > 0 && (
                                 <span className="text-sm text-gray-400 line-through font-medium">৳{p.price.toLocaleString()}</span>
                              )}
                           </div>

                           <button
                              onClick={() => scrollToForm(p)}
                              className="w-full bg-black text-white py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                           >
                              অর্ডার করুন
                           </button>
                        </div>
                     </div>
                  </div>
               )) : (
                  <div className="col-span-full text-center py-20">
                      <p className="text-gray-400 font-bold">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>
                  </div>
               )}
            </div>
         </section>

         {/* CALL TO ACTION / PHONE SECTION */}
         <section className="bg-gray-50 py-24 md:py-32 relative overflow-hidden border-y border-gray-100">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 uppercase tracking-tighter leading-tight">অর্ডার করতে বা বিস্তারিত জানতে কল করুন</h2>
               <a 
                  href={`tel:${settings.contactNumber}`} 
                  className="inline-flex items-center gap-4 bg-black text-white px-10 md:px-16 py-6 rounded-3xl font-black shadow-2xl hover:bg-blue-600 transition-all text-xl md:text-3xl tracking-tighter"
               >
                  <HiOutlinePhone className="text-3xl md:text-5xl text-blue-500" />
                  {settings.contactNumber}
               </a>
            </div>
         </section>

         {/* ORDER FORM SECTION */}
         <section ref={formRef} className="max-w-3xl mx-auto px-6 py-20 md:py-32">
            <div className="bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-16 rounded-[3rem] md:rounded-[4rem]">
               <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">অর্ডার নিশ্চিত করুন</h2>
                  <p className="text-sm text-gray-500 font-medium tracking-wide">সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন</p>
               </div>

               <form onSubmit={handleOrder} className="space-y-8">
                  {selectedProduct && (
                     <div className="bg-gray-50 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-6 mb-10 border border-gray-100 relative group">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 p-2">
                           <img
                              src={selectedProduct.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                              className="w-full h-full object-contain"
                              alt={selectedProduct.name}
                           />
                        </div>
                        <div>
                           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">নির্বাচিত পণ্য</h4>
                           <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">{selectedProduct.name}</h3>
                           <p className="text-2xl font-black text-blue-600">৳{(selectedProduct.discountPrice > 0 ? selectedProduct.discountPrice : selectedProduct.price).toLocaleString()}</p>
                        </div>
                     </div>
                  )}

                  <div className="grid gap-6 md:gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">আপনার নাম</label>
                        <input
                           type="text"
                           required
                           className="store-input"
                           placeholder="আপনার নাম লিখুন"
                           value={customer.name}
                           onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">মোবাইল নম্বর</label>
                        <input
                           type="tel"
                           required
                           className="store-input"
                           placeholder="১১ ডিজিটের মোবাইল নম্বর"
                           value={customer.phone}
                           onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">সম্পূর্ণ ঠিকানা</label>
                        <textarea
                           required
                           rows="3"
                           className="store-input resize-none"
                           placeholder="বাসা নম্বর, রোড, এলাকা এবং জেলা"
                           value={customer.address}
                           onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        ></textarea>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">শিপিং পদ্ধতি</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <label className="cursor-pointer group">
                              <input
                                 type="radio"
                                 className="hidden"
                                 name="city"
                                 checked={customer.city === "Dhaka"}
                                 onChange={() => setCustomer({ ...customer, city: "Dhaka" })}
                              />
                              <div className={`text-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all shadow-sm ${customer.city === "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 group-hover:border-gray-200"}`}>
                                 ঢাকা সিটি (৳{settings.shippingInsideDhaka})
                              </div>
                           </label>
                           <label className="cursor-pointer group">
                              <input
                                 type="radio"
                                 className="hidden"
                                 name="city"
                                 checked={customer.city !== "Dhaka"}
                                 onChange={() => setCustomer({ ...customer, city: "Outside" })}
                              />
                              <div className={`text-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all shadow-sm ${customer.city !== "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 group-hover:border-gray-200"}`}>
                                 ঢাকার বাইরে (৳{settings.shippingOutsideDhaka})
                              </div>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] mt-10 text-gray-900 border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="space-y-4 text-gray-500 font-medium border-b border-gray-200 pb-6 mb-6">
                        <div className="flex justify-between">
                           <span className="text-[10px] uppercase tracking-widest">পণ্যের মূল্য</span>
                           <span className="font-black text-gray-900">৳{(selectedProduct ? (selectedProduct.discountPrice > 0 ? selectedProduct.discountPrice : selectedProduct.price) : 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-[10px] uppercase tracking-widest">শিপিং চার্জ</span>
                           <span className="font-black text-gray-900">৳{customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka}</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">সর্বমোট পরিশোধযোগ্য</span>
                        <span className="text-3xl md:text-4xl font-black text-blue-600">৳{(selectedProduct ? ((selectedProduct.discountPrice > 0 ? selectedProduct.discountPrice : selectedProduct.price) + (customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka)) : 0).toLocaleString()}</span>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={orderLoading}
                     className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98]"
                  >
                     {orderLoading ? "অর্ডার সম্পন্ন হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[9px] text-gray-400 font-black uppercase tracking-widest">
                     <HiCheckCircle className="text-blue-500 text-xl" />
                     ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)
                  </div>
               </form>
            </div>
         </section>

         {/* MOBILE STICKY CTA */}
         <div className="fixed bottom-6 left-6 right-6 md:hidden z-[100]">
            <button
               onClick={() => scrollToForm(null)}
               className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 border border-white/10 backdrop-blur-md"
            >
               <HiOutlineShoppingBag className="text-lg" />
               পছন্দের ল্যাম্পটি অর্ডার করুন
            </button>
         </div>

         <SuccessModal 
            isOpen={showSuccess} 
            onClose={() => setShowSuccess(false)} 
            orderId={lastOrderId} 
         />

      </div>
   );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiOutlineShoppingBag, HiOutlinePhone, HiOutlineLocationMarker, HiCheckCircle, HiArrowRight, HiOutlineSparkles, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useRouter, useParams } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";
import Loading from "@/components/ui/Loading";

export default function DynamicLandingPage() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [orderLoading, setOrderLoading] = useState(false);
   const [selectedProducts, setSelectedProducts] = useState([]);
   const [showSuccess, setShowSuccess] = useState(false);
   const [lastOrderId, setLastOrderId] = useState("");
   const [showDetail, setShowDetail] = useState(false);
   const [detailProduct, setDetailProduct] = useState(null);
   const [activeSlide, setActiveSlide] = useState(0);
   const [touchStart, setTouchStart] = useState(0);
   const [touchEnd, setTouchEnd] = useState(0);

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
                  setSelectedProducts([{ ...products[0], quantity: 1 }]);
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

   const toggleProduct = (product) => {
      setSelectedProducts(prev => {
         const exists = prev.find(p => p._id === product._id);
         if (exists) {
            return prev.filter(p => p._id !== product._id);
         } else {
            return [...prev, { ...product, quantity: 1 }];
         }
      });
   };

   const openDetail = (product) => {
      setDetailProduct(product);
      setShowDetail(true);
      setActiveSlide(0);
   };

   // Auto-slide for detail modal
   useEffect(() => {
      let interval;
      if (showDetail && detailProduct) {
         const images = [detailProduct.cover, ...(detailProduct.images || [])].filter(Boolean);
         if (images.length > 1) {
            interval = setInterval(() => {
               setActiveSlide((prev) => (prev + 1) % images.length);
            }, 3000); // Change slide every 3 seconds
         }
      }
      return () => clearInterval(interval);
   }, [showDetail, detailProduct]);

   const nextSlide = () => {
      const images = [detailProduct?.cover, ...(detailProduct?.images || [])].filter(Boolean);
      setActiveSlide(prev => (prev >= images.length - 1 ? 0 : prev + 1));
   };

   const prevSlide = () => {
      const images = [detailProduct?.cover, ...(detailProduct?.images || [])].filter(Boolean);
      setActiveSlide(prev => (prev <= 0 ? images.length - 1 : prev - 1));
   };

   const updateQuantity = (id, delta) => {
      setSelectedProducts(prev => prev.map(p =>
         p._id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p
      ));
   };

   const scrollToForm = (product) => {
      if (product) {
         setSelectedProducts(prev => {
            const exists = prev.find(p => p._id === product._id);
            if (exists) return prev;
            return [...prev, { ...product, quantity: 1 }];
         });
      }
      formRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   const handleOrder = async (e) => {
      e.preventDefault();
      if (selectedProducts.length === 0) return alert("দয়া করে অন্তত একটি পণ্য সিলেক্ট করুন");
      if (!customer.name || !customer.phone || !customer.address) return alert("দয়া করে সব তথ্য পূরণ করুন");

      setOrderLoading(true);
      try {
         const shippingCost = Number(customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka);

         const items = selectedProducts.map(p => ({
            product: p._id,
            name: p.name,
            price: Number(p.discountPrice > 0 ? p.discountPrice : p.price),
            quantity: p.quantity || 1,
            image: p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"
         }));

         const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

         const orderData = {
            items,
            customer,
            subTotal,
            shippingCost,
            totalPrice: subTotal + shippingCost,
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
            alert(data.message || "অর্ডার সম্পন্ন করা যায়নি");
         }
      } catch (err) {
         alert("সার্ভার সমস্যা, আবার চেষ্টা করুন");
      } finally {
         setOrderLoading(false);
      }
   };

   if (loading) return <Loading />;

   const totalProductPrice = selectedProducts.reduce((acc, p) => acc + ((p.discountPrice > 0 ? p.discountPrice : p.price) * (p.quantity || 1)), 0);
   const shippingCharge = customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka;

   return (
      <div className="bg-[#ffffff] min-h-screen text-gray-900 selection:bg-green-100 pb-20 md:pb-32 font-hind">

         {/* HERO SECTION - COMMENTED OUT */}
         {/*<section className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
            ...
         </section>*/}

         {/* PRODUCT LIST SECTION */}
         <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 md:mb-24 border-b-2 border-gray-100 pb-10">
               <div className="flex items-center gap-4">
                  <img src="/logo.jpg" alt="HatimZone logo" className="w-16 h-16 md:w-24 md:h-24 object-contain animate-float" alt="HatimZone Icon" />
                  <div className="w-1.5 h-12 bg-green-600 rounded-full hidden md:block" />
               </div>
               <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center md:text-right leading-none">
                  {keyword ? `${decodeURIComponent(keyword)} কালেকশন` : "table-lamp কালেকশন"}
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4">
               {products.length > 0 ? products.map((p) => {
                  const isSelected = selectedProducts.some(sp => sp._id === p._id);
                  return (
                     <div
                        key={p._id}
                        onClick={() => toggleProduct(p)}
                        className={`store-card group flex flex-col bg-white rounded-lg overflow-hidden border-2 transition-all duration-500 cursor-pointer ${isSelected ? 'border-green-600 shadow-xl' : 'border-gray-50 shadow-sm hover:shadow-md'}`}
                     >
                        <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                           <img
                              src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              alt={p.name}
                           />
                           {isSelected && (
                              <div className="absolute top-2 right-2 bg-green-600 text-white p-1.5 rounded-full shadow-2xl z-20 animate-in zoom-in duration-300">
                                 <HiCheckCircle className="text-xl" />
                              </div>
                           )}
                           {p.discountPrice > 0 && (
                              <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl z-10">
                                 সেল
                              </div>
                           )}
                        </div>
                        <div className="p-4 md:p-6 flex flex-col flex-1">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{p.brand || "প্রিমিয়াম ব্র্যান্ড"}</p>
                           <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-4 h-10 leading-tight group-hover:text-green-600 transition-colors">{p.name}</h3>

                           <div className="mt-auto space-y-3">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-xl font-black text-gray-900">৳{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</span>
                                 {p.discountPrice > 0 && (
                                    <span className="text-xs text-gray-600 line-through font-medium">৳{p.price.toLocaleString()}</span>
                                 )}
                              </div>

                              <button
                                 onClick={(e) => { e.stopPropagation(); openDetail(p); }}
                                 className="w-full bg-gray-100 text-gray-900 py-2.5 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 border border-gray-200"
                              >
                                 বিস্তারিত দেখুন
                              </button>

                              <div className="grid grid-cols-2 gap-2">
                                 <button
                                    onClick={(e) => { e.stopPropagation(); scrollToForm(p); }}
                                    className="bg-black text-white py-3 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95 shadow-lg"
                                 >
                                    অর্ডার
                                 </button>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); toggleProduct(p); }}
                                    className={`py-3 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border-2 ${isSelected ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-green-50 text-green-600 hover:border-green-100"}`}
                                 >
                                    {isSelected ? "বাদ দিন" : "সিলেক্ট"}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               }) : (
                  <div className="col-span-full text-center py-20">
                     <p className="text-gray-600 font-bold">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>
                  </div>
               )}
            </div>
         </section>

         {/* CALL TO ACTION / PHONE SECTION */}
         <section className="bg-gray-50 py-16 md:py-20 relative overflow-hidden border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
               <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-tight max-w-2xl text-center md:text-left">
                  অর্ডার করতে বা বিস্তারিত জানতে কল করুন
               </h2>
               <a
                  href={`tel:${settings.contactNumber}`}
                  className="inline-flex items-center gap-4 bg-black text-white px-10 md:px-14 py-5 rounded-3xl font-black shadow-2xl hover:bg-green-600 transition-all text-xl md:text-2xl tracking-tighter shrink-0"
               >
                  <HiOutlinePhone className="text-2xl md:text-3xl text-green-500" />
                  {settings.contactNumber}
               </a>
            </div>
         </section>

         {/* ORDER SECTION - SPLIT LAYOUT */}
         <section ref={formRef} className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-32">
            <div className="bg-white shadow-xl border border-gray-100 p-5 md:p-20 rounded-3xl">
               <div className="flex flex-col items-center justify-center gap-4 mb-10 md:mb-24">
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                     <img src="/logo.jpg" alt="HatimZone logo" className="w-16 h-16 md:w-24 md:h-24 object-contain animate-float" alt="HatimZone Icon" />
                  </div>
                  <div className="text-center">
                     <h2 className="text-2xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">অর্ডার নিশ্চিত করুন</h2>
                     <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px] md:text-[11px] mt-2">বাকি তথ্যগুলো পূরণ করে অর্ডারটি শেষ করুন</p>
                  </div>
               </div>

               <form onSubmit={handleOrder}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                     {/* LEFT COLUMN: ORDER FORM */}
                     <div className="space-y-6 md:space-y-8">
                        <div className="bg-gray-50/50 p-5 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                           <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[12px]">১</span>
                              আপনার তথ্য
                           </h3>
                           <div className="grid gap-6">
                              <div>
                                 <label className="block text-[12px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-2">আপনার নাম</label>
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
                                 <label className="block text-[12px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-2">মোবাইল নম্বর</label>
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
                                 <label className="block text-[12px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-2">সম্পূর্ণ ঠিকানা</label>
                                 <textarea
                                    required
                                    rows="3"
                                    className="store-input resize-none"
                                    placeholder="বাসা নম্বর, রোড, এলাকা এবং জেলা"
                                    value={customer.address}
                                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                 ></textarea>
                              </div>
                           </div>
                        </div>

                        <div className="bg-gray-50/50 p-5 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                           <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[12px]">২</span>
                              শিপিং পদ্ধতি
                           </h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <label className="cursor-pointer group">
                                 <input
                                    type="radio"
                                    className="hidden"
                                    name="city"
                                    checked={customer.city === "Dhaka"}
                                    onChange={() => setCustomer({ ...customer, city: "Dhaka" })}
                                 />
                                 <div className={`text-center py-5 rounded-3xl font-black text-[12px] uppercase tracking-widest border-2 transition-all shadow-sm ${customer.city === "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-600 group-hover:border-gray-200"}`}>
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
                                 <div className={`text-center py-5 rounded-3xl font-black text-[12px] uppercase tracking-widest border-2 transition-all shadow-sm ${customer.city !== "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-600 group-hover:border-gray-200"}`}>
                                    ঢাকার বাইরে (৳{settings.shippingOutsideDhaka})
                                 </div>
                              </label>
                           </div>
                        </div>
                     </div>

                     {/* RIGHT COLUMN: SELECTED PRODUCTS & SUMMARY */}
                     <div className="space-y-8">
                        <div className="bg-gray-50/50 p-5 md:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                           <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[12px]">৩</span>
                              আপনার নির্বাচন
                           </h3>

                           {selectedProducts.length > 0 ? (
                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex-1 mb-8">
                                 {selectedProducts.map((item) => (
                                    <div key={item._id} className="bg-white p-4 rounded-3xl flex items-center gap-4 border border-gray-100 shadow-sm relative group transition-all hover:scale-[1.02]">
                                       <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-md flex-shrink-0 bg-gray-50">
                                          <img
                                             src={item.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                                             className="w-full h-full object-cover"
                                             alt={item.name}
                                          />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                          <p className="text-lg font-black text-green-600">৳{(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}</p>

                                          <div className="flex items-center gap-2 mt-2">
                                             <button type="button" onClick={() => updateQuantity(item._id, -1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">-</button>
                                             <span className="text-xs font-bold">{item.quantity || 1}</span>
                                             <button type="button" onClick={() => updateQuantity(item._id, 1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">+</button>
                                          </div>
                                       </div>
                                       <button
                                          type="button"
                                          onClick={() => toggleProduct(item)}
                                          className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                       >
                                          ✕
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="bg-white border border-dashed border-gray-200 p-12 rounded-[2rem] text-center flex-1 mb-8 flex items-center justify-center">
                                 <p className="text-gray-600 font-bold text-sm leading-relaxed">এখনো কোনো পণ্য নির্বাচন করা হয়নি।</p>
                              </div>
                           )}

                           <div className="mt-auto space-y-6 pt-10 border-t border-gray-100">
                              <div className="space-y-4 text-gray-500 font-medium">
                                 <div className="flex justify-between">
                                    <span className="text-[12px] uppercase tracking-widest">পণ্যের মূল্য</span>
                                    <span className="font-black text-gray-900">৳{totalProductPrice.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-[12px] uppercase tracking-widest">শিপিং চার্জ</span>
                                    <span className="font-black text-gray-900">৳{shippingCharge}</span>
                                 </div>
                              </div>
                              <div className="flex justify-between items-center bg-black text-white p-6 md:p-8 rounded-3xl shadow-2xl">
                                 <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black">সর্বমোট পরিশোধযোগ্য</span>
                                 <span className="text-2xl md:text-3xl font-black">৳{(totalProductPrice + shippingCharge).toLocaleString()}</span>
                              </div>

                              <button
                                 type="submit"
                                 disabled={orderLoading}
                                 className="w-full py-6 bg-green-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-green-700 transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98]"
                              >
                                 {orderLoading ? "অর্ডার সম্পন্ন হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
                              </button>

                              <div className="flex items-center justify-center gap-3 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                                 <HiCheckCircle className="text-green-500 text-xl" />
                                 ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </form>
            </div>
         </section>

         {/* MOBILE STICKY CTA */}
         <div className="fixed bottom-6 left-6 right-6 md:hidden z-[100]">
            <button
               onClick={() => scrollToForm(null)}
               className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 border border-white/10 backdrop-blur-md"
            >
               <HiOutlineShoppingBag className="text-lg" />
               পছন্দের পণ্যটি অর্ডার করুন
            </button>
         </div>

         {/* PRODUCT DETAIL MODAL */}
         {showDetail && detailProduct && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
               <div className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[95vh] border border-gray-100 mx-auto">

                  {/* IMAGE SIDE WITH SLIDER */}
                  <div 
                      className="w-full md:w-[55%] bg-gray-50 h-[300px] sm:h-[400px] md:h-auto overflow-hidden relative group shrink-0"
                      onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                      onTouchEnd={() => {
                         if (touchStart - touchEnd > 70) nextSlide();
                         if (touchStart - touchEnd < -70) prevSlide();
                      }}
                   >
                     {(() => {
                        const images = [detailProduct.cover, ...(detailProduct.images || [])].filter(Boolean);
                        if (images.length === 0) images.push("https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image");

                        return (
                           <>
                              <div className="flex h-full w-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                                 {images.map((img, idx) => (
                                    <img
                                       key={idx}
                                       src={img}
                                       className="w-full h-full object-cover flex-shrink-0"
                                       alt={`${detailProduct.name} ${idx + 1}`}
                                    />
                                 ))}
                              </div>

                              {images.length > 1 && (
                                 <>
                                    {/* Navigation Arrows */}
                                    <button
                                       onClick={() => setActiveSlide((prev) => (prev - 1 + images.length) % images.length)}
                                       className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black hover:text-white z-20"
                                    >
                                       <HiChevronLeft className="text-xl" />
                                    </button>
                                    <button
                                       onClick={() => setActiveSlide((prev) => (prev + 1) % images.length)}
                                       className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black hover:text-white z-20"
                                    >
                                       <HiChevronRight className="text-xl" />
                                    </button>

                                    {/* Slider Navigation Dots */}
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                                       {images.map((_, i) => (
                                          <button
                                             key={i}
                                             onClick={() => setActiveSlide(i)}
                                             className={`w-2 md:w-10 h-1 rounded-full transition-all ${activeSlide === i ? 'bg-green-600 w-12' : 'bg-white/40'}`}
                                          />
                                       ))}
                                    </div>
                                 </>
                              )}
                           </>
                        );
                     })()}

                     {/* Corner Selection Indicator */}
                     {selectedProducts.some(sp => sp._id === detailProduct._id) && (
                        <div className="absolute top-8 left-8 bg-green-600 text-white p-4 rounded-full shadow-2xl animate-bounce z-20">
                           <HiCheckCircle className="text-3xl" />
                        </div>
                     )}
                  </div>

                  {/* INFO SIDE */}
                  <div className="w-full md:w-[45%] p-6 md:p-16 overflow-y-auto bg-white flex flex-col">
                     <button
                        onClick={() => setShowDetail(false)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-black/5 md:bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-black hover:text-white transition-all shadow-sm z-[210]"
                     >
                        ✕
                     </button>

                     <div className="mb-auto">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-8">
                           <HiOutlineSparkles className="text-[10px] md:text-sm" />
                           <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest">{detailProduct.brand || "প্রিমিয়াম ব্র্যান্ড"}</span>
                        </div>
                        <h2 className="text-xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4 md:mb-8 leading-tight">{detailProduct.name}</h2>

                        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-12">
                           <span className="text-2xl md:text-6xl font-black text-gray-900">৳{(detailProduct.discountPrice > 0 ? detailProduct.discountPrice : detailProduct.price).toLocaleString()}</span>
                           {detailProduct.discountPrice > 0 && (
                              <div className="flex flex-col">
                                 <span className="text-sm md:text-base text-gray-600 line-through font-medium leading-none mb-1">৳{detailProduct.price.toLocaleString()}</span>
                                 <span className="text-[10px] md:text-[12px] bg-red-100 text-red-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black uppercase tracking-tighter">সেভ ৳{(detailProduct.price - detailProduct.discountPrice).toLocaleString()}</span>
                              </div>
                           )}
                        </div>

                        <div className="space-y-6 md:space-y-8 text-sm md:text-base text-gray-500 font-medium mb-8 md:mb-12 leading-relaxed">
                           <p className="line-clamp-4 md:line-clamp-none">{detailProduct.description || "এই পণ্যটি সম্পর্কে বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে।"}</p>
                           <div className="grid grid-cols-2 gap-3 md:gap-6 pt-4 md:pt-6">
                              <div className="bg-gray-50 p-3 md:p-4 rounded-3xl flex flex-col gap-1 md:gap-2">
                                 <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-600">কোয়ালিটি</span>
                                 <span className="text-[10px] md:text-xs font-black text-gray-900">১০০% অরিজিনাল</span>
                              </div>
                              <div className="bg-gray-50 p-3 md:p-4 rounded-3xl flex flex-col gap-1 md:gap-2">
                                 <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-600">ডেলিভারি</span>
                                 <span className="text-[10px] md:text-xs font-black text-gray-900">ফাস্ট শিপিং</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-3 md:gap-4 pt-6 md:pt-12 border-t border-gray-100">
                        {(() => {
                           const selected = selectedProducts.find(sp => sp._id === detailProduct._id);
                           return (
                              <>
                                 {selected && (
                                    <div className="flex items-center justify-center gap-6 mb-2 md:mb-4 bg-gray-50 py-3 md:py-4 rounded-3xl border border-gray-100">
                                       <button 
                                          type="button" 
                                          onClick={() => updateQuantity(detailProduct._id, -1)}
                                          className="w-8 h-8 md:w-10 md:h-10 bg-white shadow-sm rounded-3xl flex items-center justify-center font-black text-lg md:text-xl hover:bg-black hover:text-white transition"
                                       >
                                          -
                                       </button>
                                       <span className="text-lg md:text-xl font-black">{selected.quantity || 1}</span>
                                       <button 
                                          type="button" 
                                          onClick={() => updateQuantity(detailProduct._id, 1)}
                                          className="w-8 h-8 md:w-10 md:h-10 bg-white shadow-sm rounded-3xl flex items-center justify-center font-black text-lg md:text-xl hover:bg-black hover:text-white transition"
                                       >
                                          +
                                       </button>
                                    </div>
                                 )}
                                 <button
                                    onClick={() => { scrollToForm(detailProduct); setShowDetail(false); }}
                                    className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-green-600 transition-all active:scale-[0.98]"
                                 >
                                    এখনই অর্ডার করুন
                                 </button>
                                 <button
                                    onClick={() => { toggleProduct(detailProduct); }}
                                    className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs border-2 transition-all ${selected ? "bg-red-50 border-red-500 text-red-600" : "bg-white border-gray-200 text-gray-900 hover:border-black"}`}
                                 >
                                    {selected ? "বাদ দিন" : "নির্বাচন করুন"}
                                 </button>
                              </>
                           );
                        })()}
                     </div>
                  </div>
               </div>
            </div>
         )}

         <SuccessModal
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            orderId={lastOrderId}
         />

      </div>
   );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiOutlineShoppingBag, HiOutlinePhone, HiOutlineLocationMarker, HiCheckCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function LandingPage() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [orderLoading, setOrderLoading] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);

   const [settings, setSettings] = useState({
      shippingInsideDhaka: 60,
      shippingOutsideDhaka: 120,
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

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch products
            const pRes = await fetch("/api/admin/products?limit=50");
            const pData = await pRes.json();
            if (pData.success) {
               setProducts(pData.data.items || []);
               if (pData.data.items?.length > 0) {
                  setSelectedProduct(pData.data.items[0]);
               }
            }

            // Fetch settings
            const sRes = await fetch("/api/settings");
            const sData = await sRes.json();
            if (sData.success) {
               setSettings(sData.data);
            }
         } catch (err) {
            console.error("Failed to fetch data");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

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
         const shippingCost = customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka;
         const orderData = {
            items: [{
               product: selectedProduct._id,
               name: selectedProduct.name,
               price: selectedProduct.price, // selectedProduct.discountPrice || selectedProduct.price,
               quantity: 1,
               image: selectedProduct.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"
            }],
            customer,
            subTotal: selectedProduct.price, // selectedProduct.discountPrice || selectedProduct.price,
            shippingCost: shippingCost,
            totalPrice: selectedProduct.price + shippingCost, // (selectedProduct.discountPrice || selectedProduct.price) + shippingCost,
            paymentMethod: "Cash on Delivery",
            notes: "Landing Page Order"
         };

         const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
         });

         const data = await res.json();
         if (data.success) {
            router.push(`/order-success?id=${data.data.orderId}`);
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
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
   );

   return (
      <div className="bg-[#EAEDED] min-h-screen font-sans selection:bg-[#FEB069] pb-20 md:pb-24">

         {/* HERO SECTION */}
         <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute inset-0 z-0">
               <img
                  src="https://images.unsplash.com/photo-1581210020469-hp1kWCABonI?auto=format&fit=crop&w=2000&q=80"
                  alt="Exclusive Lamp"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/50" />
            </div>
            
            <div className="relative z-10 text-center px-4 max-w-4xl">
               <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">এক্সক্লুসিভ লাইটিং কালেকশন</h1>
               <p className="text-sm md:text-lg text-white/80 font-bold max-w-2xl mx-auto">আপনার ঘরকে আলোকিত করতে সেরা ল্যাম্পটি বেছে নিন এবং দ্রুত অর্ডার করুন</p>
               <button 
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 bg-[#FFD814] text-[#0F1111] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition shadow-2xl"
               >
                  নিচে দেখুন
               </button>
            </div>
         </section>

         {/* 1. PRODUCT SHOWCASE SECTION - 2 COLUMN GRID */}
         <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
               {products.map((p) => (
                  <div key={p._id} className="bg-white overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition rounded-xl group">
                     <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img
                           src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                           alt={p.name}
                        />
                     </div>
                     <div className="p-3 md:p-4 flex flex-col flex-1">
                        <h2 className="text-[12px] md:text-[14px] font-bold text-[#0F1111] line-clamp-2 mb-1 h-10 leading-tight">{p.name}</h2>

                        <div className="flex items-center gap-1 mb-2">
                           <div className="flex text-orange-400 text-[8px] md:text-[10px]">
                              {"★★★★★".split("").map((s, i) => <span key={i}>★</span>)}
                           </div>
                           <span className="text-[8px] md:text-[10px] text-blue-600 font-medium">(৮৭৫ জন রিভিউ দিয়েছেন)</span>
                        </div>

                        <div className="mt-auto pt-2">
                           <div className="flex flex-col mb-3">
                              <span className="text-base md:text-xl font-black text-[#B12704]">৳{p.price.toLocaleString()}</span>
                           </div>

                           <button
                              onClick={() => scrollToForm(p)}
                              className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200] w-full py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition active:scale-95 shadow-sm"
                           >
                              অর্ডার করুন
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* 2. CONTACT SECTION */}
         <section className="bg-white border-y border-gray-200 py-12 my-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
               <h2 className="text-xl md:text-2xl font-black text-[#0F1111] mb-6 uppercase tracking-tighter">সরাসরি কথা বলতে কল করুন</h2>
               <a href={`tel:${settings.contactNumber}`} className="inline-flex items-center gap-3 bg-[#FFD814] px-8 md:px-10 py-4 rounded-full font-black shadow-sm border border-[#FCD200] hover:bg-[#F7CA00] transition text-base md:text-lg">
                  <HiOutlinePhone className="text-2xl" />
                  {settings.contactNumber}
               </a>
            </div>
         </section>

         {/* 3. ORDER FORM SECTION - AT THE BOTTOM */}
         <section ref={formRef} className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white shadow-xl border border-gray-100 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem]">
               <div className="border-b border-gray-100 pb-6 mb-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-black text-[#0F1111] uppercase tracking-tighter">অর্ডার নিশ্চিত করতে ফর্মটি পূরণ করুন</h2>
                  <p className="text-xs md:text-sm text-[#565959] mt-2 font-medium">খুব দ্রুত আমরা আপনার সাথে যোগাযোগ করব</p>
               </div>

               <form onSubmit={handleOrder} className="space-y-6">
                  {selectedProduct && (
                     <div className="bg-[#F7F7F7] p-4 md:p-6 rounded-xl flex items-center gap-4 mb-8 border border-gray-100">
                        <img
                           src={selectedProduct.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                           className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-sm bg-white object-contain p-1 border border-gray-100"
                        />
                        <div>
                           <h4 className="text-sm font-bold text-[#0F1111] line-clamp-1">{selectedProduct.name}</h4>
                           <p className="text-xl font-black text-[#B12704]">৳{selectedProduct.price.toLocaleString()}</p>
                        </div>
                     </div>
                  )}

                  <div className="grid gap-5">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">আপনার নাম</label>
                        <input
                           type="text"
                           required
                           className="store-input bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                           placeholder="সম্পূর্ণ নাম লিখুন"
                           value={customer.name}
                           onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">মোবাইল নম্বর</label>
                        <input
                           type="tel"
                           required
                           className="store-input bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                           placeholder="১১ ডিজিটের মোবাইল নম্বর"
                           value={customer.phone}
                           onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">ঠিকানা</label>
                        <textarea
                           required
                           rows="3"
                           className="store-input bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-bold resize-none"
                           placeholder="বাসা নম্বর, রোড, এলাকা এবং জেলা লিখুন"
                           value={customer.address}
                           onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        ></textarea>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">শিপিং এলাকা</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                           <label className="flex-1 cursor-pointer">
                              <input
                                 type="radio"
                                 className="hidden"
                                 name="city"
                                 checked={customer.city === "Dhaka"}
                                 onChange={() => setCustomer({ ...customer, city: "Dhaka" })}
                              />
                              <div className={`text-center py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition shadow-sm ${customer.city === "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"}`}>
                                 ঢাকা সিটি (৳{settings.shippingInsideDhaka})
                              </div>
                           </label>
                           <label className="flex-1 cursor-pointer">
                              <input
                                 type="radio"
                                 className="hidden"
                                 name="city"
                                 checked={customer.city !== "Dhaka"}
                                 onChange={() => setCustomer({ ...customer, city: "Outside" })}
                              />
                              <div className={`text-center py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition shadow-sm ${customer.city !== "Dhaka" ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"}`}>
                                 ঢাকার বাইরে (৳{settings.shippingOutsideDhaka})
                              </div>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#F7F7F7] p-6 rounded-xl border border-gray-100 mt-8">
                     <div className="space-y-3 text-sm text-gray-500 font-medium border-b border-gray-200 pb-4 mb-4">
                        <div className="flex justify-between">
                           <span>পণ্যের মূল্য</span>
                           <span className="font-black text-gray-900">৳{selectedProduct ? selectedProduct.price.toLocaleString() : 0}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>শিপিং চার্জ</span>
                           <span className="font-black text-gray-900">৳{customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka}</span>
                        </div>
                     </div>
                     <div className="flex justify-between text-2xl font-black text-[#B12704] uppercase tracking-tighter">
                        <span>সর্বমোট</span>
                        <span>৳{selectedProduct ? (selectedProduct.price + (customer.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka)).toLocaleString() : 0}</span>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={orderLoading}
                     className="w-full py-4.5 bg-[#FFD814] text-[#0F1111] rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#F7CA00] transition shadow-xl border border-[#FCD200] disabled:opacity-50"
                  >
                     {orderLoading ? "অর্ডার সম্পন্ন হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">
                     <HiCheckCircle className="text-green-600 text-lg" />
                     ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)
                  </div>
               </form>
            </div>
         </section>

         {/* STICKY FOOTER CTA FOR MOBILE */}
         <div className="fixed bottom-0 left-0 w-full p-4 md:hidden z-[100]">
            <button
               onClick={() => scrollToForm(null)}
               className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-base shadow-2xl flex items-center justify-center gap-2 animate-bounce-subtle"
            >
               <HiOutlineShoppingBag />
               পছন্দের ল্যাম্পটি অর্ডার করুন
            </button>
         </div>

      </div>
   );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { HiCheckCircle, HiChevronRight, HiShoppingBag } from "react-icons/hi";
import SuccessModal from "@/components/SuccessModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Dhaka",
    paymentMethod: "Cash on Delivery",
    notes: ""
  });

  const [settings, setSettings] = useState({
    shippingInsideDhaka: 60,
    shippingOutsideDhaka: 120
  });

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Settings fetch error");
      }
    };
    fetchSettings();
  }, []);

  const subTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shippingCost = formData.city === "Dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka;
  const total = subTotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          variant: item.variant,
          image: item.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"
        })),
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        subTotal,
        shippingCost,
        totalPrice: total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        // Save phone to localStorage for auto-login on account page
        localStorage.setItem("userPhone", formData.phone);
        
        // Show Success Modal instead of redirect
        setLastOrderId(data.data.orderId);
        setShowSuccess(true);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty - handle in useEffect to avoid SSR issues
  React.useEffect(() => {
    if (cart.length === 0 && !showSuccess) {
      router.push("/cart");
    }
  }, [cart, router, showSuccess]);

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="font-bold text-gray-500 uppercase tracking-widest animate-pulse">Redirecting to cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        <div className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-gray-600 uppercase tracking-widest mb-6 md:mb-8">
          <span>Cart</span>
          <HiChevronRight />
          <span className="text-black">Checkout</span>
          <HiChevronRight />
          <span>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
          
          {/* Shipping Form */}
          <div className="space-y-8 md:space-y-10">
            <div>
              <h1 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm">1</div>
                Delivery Details
              </h1>
              
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-5 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition text-gray-800 font-bold bg-white shadow-sm text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="017XXXXXXXX"
                      className="w-full px-5 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition text-gray-800 font-bold bg-white shadow-sm text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Delivery Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no, Road no, Area, Thana..."
                    rows={3}
                    className="w-full px-5 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition resize-none text-gray-800 font-bold bg-white shadow-sm text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Your City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition appearance-none bg-white text-gray-800 font-bold shadow-sm text-sm"
                    >
                      <option value="Dhaka">Dhaka City (৳{settings.shippingInsideDhaka})</option>
                      <option value="Outside Dhaka">Outside Dhaka (৳{settings.shippingOutsideDhaka})</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Payment Method</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3.5 md:p-4 rounded-xl border cursor-pointer transition shadow-sm ${formData.paymentMethod === 'Cash on Delivery' ? 'border-black bg-black text-white' : 'border-gray-100 bg-white hover:border-black'}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="Cash on Delivery" 
                          checked={formData.paymentMethod === 'Cash on Delivery'} 
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-center">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Delivery Notes (Optional)</label>
                  <input
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Anything else we should know?"
                    className="w-full px-5 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition text-gray-800 font-bold bg-white shadow-sm text-sm"
                  />
                </div>
              </form>
            </div>

            <div className="p-5 md:p-6 bg-blue-50/50 rounded-2xl md:rounded-3xl border border-blue-100 flex gap-4">
              <div className="text-xl md:text-2xl">🛡️</div>
              <div>
                <p className="font-black text-blue-900 uppercase tracking-tighter text-sm">Light Protection</p>
                <p className="text-xs md:text-sm text-blue-700 font-medium leading-relaxed">We guarantee safe delivery of your lamps. If anything breaks during shipping, we'll replace it for free.</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <HiShoppingBag className="text-gray-600" />
                Selected Lamps
              </h2>

              <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"} alt={item.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs md:text-sm truncate text-gray-900">{item.name}</p>
                      <p className="text-[11px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">{item.quantity} x ৳{(item.discountPrice || item.price).toLocaleString()}</p>
                    </div>
                    <p className="font-black text-sm md:text-base">৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-50 pt-6 md:pt-8 mb-8 md:mb-10">
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Lamp Total</span>
                  <span className="font-black text-gray-900">৳{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Shipping Cost</span>
                  <span className="font-black text-gray-900">৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-dashed border-gray-200">
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-600 mb-1">Grand Total</span>
                  <span className="text-3xl md:text-4xl font-black text-black">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm text-white shadow-2xl transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:scale-95 shadow-gray-200"
                }`}
              >
                {loading ? "Placing Your Order..." : "Place Lamp Order"}
              </button>

              <div className="mt-6 md:mt-8 flex items-center gap-3 text-[11px] md:text-xs text-green-600 font-bold uppercase tracking-widest justify-center">
                <HiCheckCircle className="text-lg" />
                Secure Lighting Checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => {
            setShowSuccess(false);
            router.push("/shop");
        }} 
        orderId={lastOrderId} 
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { HiCheckCircle, HiChevronRight, HiShoppingBag } from "react-icons/hi";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Dhaka",
    paymentMethod: "Cash on Delivery",
    notes: ""
  });

  const [loading, setLoading] = useState(false);

  const subTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shippingCost = formData.city === "Dhaka" ? 60 : 120;
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
          image: item.images?.[0]
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
        // Redirect to success page or account page
        router.push(`/order-success?id=${data.data.orderId}`);
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

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Cart</span>
          <HiChevronRight />
          <span className="text-black font-bold">Checkout</span>
          <HiChevronRight />
          <span>Payment</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Shipping Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</div>
                Shipping Information
              </h1>
              
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition text-gray-800 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="017XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition text-gray-800 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Full Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no, Road no, Area..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition resize-none text-gray-800 font-bold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition appearance-none bg-white text-gray-800 font-bold"
                    >
                      <option value="Dhaka">Dhaka (60৳)</option>
                      <option value="Outside Dhaka">Outside Dhaka (120৳)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Payment Method</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${formData.paymentMethod === 'Cash on Delivery' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="Cash on Delivery" 
                          checked={formData.paymentMethod === 'Cash on Delivery'} 
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-sm font-bold text-center">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Order Notes (Optional)</label>
                  <input
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Special instructions for delivery"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition text-gray-800 font-bold"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
              <div className="text-2xl">🛡️</div>
              <div>
                <p className="font-bold text-blue-900">Buyer Protection</p>
                <p className="text-sm text-blue-700">Get a full refund if the item is not as described or if is not delivered.</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HiShoppingBag />
                Order Summary
              </h2>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x ৳{item.discountPrice || item.price}</p>
                    </div>
                    <p className="font-bold text-sm">৳{(item.discountPrice || item.price) * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-6 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">৳{subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-gray-900">৳{shippingCost}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-dashed">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-black">৳{total}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:scale-[1.02] active:scale-95 shadow-gray-200"
                }`}
              >
                {loading ? "Processing Order..." : "Confirm Order"}
              </button>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-xs text-green-600 font-semibold justify-center">
                  <HiCheckCircle className="text-lg" />
                  Secure checkout with 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

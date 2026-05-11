"use client";

import React, { useState, useEffect } from "react";
import { HiPhone, HiClipboardList, HiTruck, HiCheckCircle, HiXCircle, HiUserCircle, HiHeart } from "react-icons/hi";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function AccountPage() {
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { wishlist } = useCart();

  // Check if phone is in localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem("userPhone");
    if (savedPhone) {
      setPhone(savedPhone);
      fetchOrders(savedPhone);
    }
  }, []);

  const fetchOrders = async (phoneNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/order?phone=${phoneNum}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setIsLoggedIn(true);
        localStorage.setItem("userPhone", phoneNum);
      } else {
        alert(data.message || "Could not find orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Please enter a valid phone number");
    fetchOrders(phone);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOrders([]);
    localStorage.removeItem("userPhone");
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/order?id=${orderId}&action=cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully");
        fetchOrders(phone);
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-orange-500 bg-orange-50 border-orange-100";
      case "Processing": return "text-blue-500 bg-blue-50 border-blue-100";
      case "Shipped": return "text-indigo-500 bg-indigo-50 border-indigo-100";
      case "Delivered": return "text-green-500 bg-green-50 border-green-100";
      case "Cancelled": return "text-red-500 bg-red-50 border-red-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-sm max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-xl">
            <HiUserCircle className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 text-center">My Account</h1>
          <p className="text-gray-500 text-center mb-8">Enter your phone number to access your orders and account.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-black outline-none transition font-semibold"
              />
            </div>
            <button
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
                loading ? "bg-gray-400" : "bg-black hover:scale-[1.02] shadow-gray-200"
              }`}
            >
              {loading ? "Accessing..." : "View Orders"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-3xl">
              👋
            </div>
            <div>
              <h1 className="text-3xl font-black">Welcome back!</h1>
              <p className="text-gray-500 font-medium">{phone}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-red-500 bg-red-50 px-6 py-3 rounded-xl hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
              <HiClipboardList className="text-2xl" />
              Recent Orders
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-black font-bold mt-4 inline-block hover:underline">Start shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-black text-gray-900">#{order.orderId}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} x ৳{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">Date</p>
                      <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold mb-1">Total Amount</p>
                      <p className="text-xl font-black text-black">৳{order.totalPrice}</p>
                    </div>
                  </div>

                  {order.status === "Pending" && (
                    <div className="px-6 pb-6 pt-2">
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                      >
                        <HiXCircle />
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Sidebar / Wishlist Summary */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <HiHeart className="text-red-500" />
                Wishlist ({wishlist.length})
              </h2>
              
              <div className="space-y-4">
                {wishlist.slice(0, 3).map((p) => (
                  <Link key={p._id} href={`/product/${p.slug}`} className="flex gap-4 items-center group">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:scale-110 transition p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-blue-600 transition">{p.name}</p>
                      <p className="text-xs font-bold text-gray-900">৳{p.discountPrice || p.price}</p>
                    </div>
                  </Link>
                ))}
                {wishlist.length > 3 && (
                  <Link href="/wishlist" className="text-xs font-bold text-blue-600 hover:underline">
                    View all {wishlist.length} items
                  </Link>
                )}
                {wishlist.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Your wishlist is empty</p>
                )}
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2">Need Help?</h2>
                <p className="text-gray-400 text-sm mb-6">Our support team is available 24/7 to assist you.</p>
                <a href="tel:+880123456789" className="flex items-center gap-3 text-lg font-bold">
                  <HiPhone className="text-green-400" />
                  +880 123 456 789
                </a>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl text-white/5 rotate-12">
                📞
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

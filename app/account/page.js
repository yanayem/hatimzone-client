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
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <HiUserCircle className="text-3xl md:text-4xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-center uppercase tracking-tighter">My Account</h1>
          <p className="text-xs md:text-sm text-gray-500 text-center mb-8 font-medium">Enter your phone number to see your orders and saved lamps.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg" />
              <input
                required
                type="tel"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-xl border border-gray-100 focus:border-black outline-none transition font-bold bg-gray-50 focus:bg-white text-sm"
              />
            </div>
            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] md:text-xs text-white shadow-xl transition-all ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                }`}
            >
              {loading ? "Finding Orders..." : "View My Orders"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-2xl md:text-3xl">
              💡
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Hello Lighting Fan!</h1>
              <p className="text-xs md:text-sm text-gray-600 font-bold uppercase tracking-widest mt-1">{phone}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[12px] md:text-xs font-black uppercase tracking-widest text-red-500 bg-red-50 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition w-fit"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">

          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-6">
              <HiClipboardList className="text-gray-600" />
              My Lamp Orders
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white p-10 md:p-16 rounded-[2rem] md:rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-600 font-bold uppercase tracking-widest text-[12px] md:text-xs">You haven't ordered any lamps yet.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[12px] mt-6 inline-block hover:bg-gray-800 transition">Shop New Lamps</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-gray-600 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-black text-gray-900 text-sm">#{order.orderId}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-[12px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="p-5 md:p-6 space-y-4 md:space-y-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 md:gap-5 items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-gray-900">{item.name}</p>
                          <p className="text-[12px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">{item.quantity} x ৳{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 md:p-6 bg-gray-50/50 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-gray-600 font-black uppercase tracking-widest mb-1">Order Date</p>
                      <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-xl font-black text-black">৳{order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  {order.status === "Pending" && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-black uppercase tracking-widest text-[12px] hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2"
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
          <div className="space-y-8 md:space-y-10">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-6">
                <HiHeart className="text-red-500" />
                Saved Lights ({wishlist.length})
              </h2>

              <div className="space-y-4 md:space-y-6">
                {wishlist.slice(0, 3).map((p) => (
                  <Link key={p._id} href={`/product/${p.slug}`} className="flex gap-4 items-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-gray-900 group-hover:text-blue-600 transition">{p.name}</p>
                      <p className="text-[12px] font-black text-gray-600 uppercase tracking-widest mt-0.5">৳{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
                {wishlist.length > 3 && (
                  <Link href="/wishlist" className="text-[12px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition block text-center pt-2">
                    View all {wishlist.length} lights
                  </Link>
                )}
                {wishlist.length === 0 && (
                  <p className="text-[12px] text-gray-600 font-bold uppercase tracking-widest italic text-center py-4">Your saved list is empty</p>
                )}
              </div>
            </div>

            <div className="bg-black p-6 md:p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2">Need Help?</h2>
                <p className="text-gray-600 text-xs md:text-sm mb-6 font-medium">Our support team is here to help you light up your home.</p>
                <a href="tel:+880123456789" className="flex items-center gap-3 text-lg md:text-xl font-black hover:text-green-400 transition-colors">
                  <HiPhone className="text-green-400 text-2xl" />
                  +880 123 456 789
                </a>
              </div>
              <div className="absolute -right-8 -bottom-8 text-9xl text-white/5 rotate-12 transition duration-700 group-hover:rotate-0 group-hover:scale-110">
                📞
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

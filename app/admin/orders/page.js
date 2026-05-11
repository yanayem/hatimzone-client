"use client";

import React, { useState, useEffect } from "react";
import { HiCheckCircle, HiRefresh, HiEye, HiTrash, HiSearch, HiFilter } from "react-icons/hi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.phone.includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-orange-500 bg-orange-50";
      case "Processing": return "text-blue-500 bg-blue-50";
      case "Shipped": return "text-indigo-500 bg-indigo-50";
      case "Delivered": return "text-green-500 bg-green-50";
      case "Cancelled": return "text-red-500 bg-red-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Orders Management</h1>
            <p className="text-gray-500 font-medium">Manage and track all customer orders</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition"
          >
            <HiRefresh className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text"
              placeholder="Search by Order ID, Customer, or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>
          <div className="relative">
            <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-black outline-none transition appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-8 h-20 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-900">#{order.orderId}</p>
                        <p className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                        <div className="flex gap-1 mt-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.image} className="w-6 h-6 rounded bg-gray-100 object-contain border border-white shadow-sm" alt="" />
                          ))}
                          {order.items.length > 3 && <span className="text-[10px] bg-gray-100 px-1 rounded flex items-center">+{order.items.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900">{order.customer.name}</p>
                        <p className="text-xs font-medium text-gray-500">{order.customer.phone}</p>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{order.customer.address}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-gray-900">৳{order.totalPrice}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{order.paymentMethod}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <select 
                          value={order.status}
                          disabled={updating === order._id}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="bg-gray-100 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-black cursor-pointer disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
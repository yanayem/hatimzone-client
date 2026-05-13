"use client";

import React, { useEffect, useState } from "react";
import {
    HiOutlineShoppingBag,
    HiOutlineCurrencyBangladeshi,
    HiOutlineCube,
    HiOutlineClock,
    HiOutlineTrendingUp,
    HiOutlineArrowRight
} from "react-icons/hi";
import Link from "next/link";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchDashboard = async () => {
            try {
                const res = await fetch("/api/admin/dashboard", { signal: controller.signal });
                const result = await res.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (err) {
                if (err.name !== 'AbortError') console.error("Dashboard fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
        return () => controller.abort();
    }, []);

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
    );

    const stats = [
        {
            label: "Total Revenue",
            value: `৳${data?.totalRevenue?.toLocaleString() || 0}`,
            icon: HiOutlineCurrencyBangladeshi,
            color: "text-green-600",
            bg: "bg-green-50",
            trend: "+12.5% this month"
        },
        {
            label: "Total Orders",
            value: data?.totalOrders || 0,
            icon: HiOutlineShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "Overall sales"
        },
        {
            label: "Pending Orders",
            value: data?.pendingOrders || 0,
            icon: HiOutlineClock,
            color: "text-orange-600",
            bg: "bg-orange-50",
            trend: "Action required"
        },
        {
            label: "Products",
            value: data?.totalProducts || 0,
            icon: HiOutlineCube,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: "In inventory"
        },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Overview</h1>
                    <p className="text-gray-500 font-bold">Real-time performance of HatimZone</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 transition-transform group-hover:scale-110`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                            <HiOutlineTrendingUp className="text-green-500" />
                            {stat.trend}
                        </p>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <stat.icon className="text-6xl" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            View All <HiOutlineArrowRight />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-8 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.recentOrders?.length > 0 ? (
                                    data.recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/30 transition">
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-black text-gray-900">#{order.orderId}</p>
                                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                                                <p className="text-[12px] text-gray-400 font-medium">{order.customer.phone}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-black text-gray-900">৳{order.totalPrice}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'Pending' ? 'bg-orange-50 text-orange-500' :
                                                        order.status === 'Delivered' ? 'bg-green-50 text-green-500' :
                                                            'bg-blue-50 text-blue-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic font-medium">
                                            No orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-8">
                    <div className="bg-gray-200 text-gray-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Admin Support</h3>
                        <p className="text-gray-400 text-sm font-bold mb-6 relative z-10 leading-relaxed">
                            Need help managing your store? Contact our technical team for assistance.
                        </p>
                        <button className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition relative z-10">
                            Get Help
                        </button>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Inventory Status</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-900">Low Stock Alert</p>
                                <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full">0 Items</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-900">Total Products</p>
                                <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{data?.totalProducts || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

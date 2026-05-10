"use client";

import { useEffect, useState } from "react";
import { FiShoppingBag, FiUsers, FiBox, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        orders: 0,
        users: 0,
        products: 0,
        revenue: 0
    });

    // Mock data for now
    useEffect(() => {
        setStats({
            orders: 124,
            users: 45,
            products: 12,
            revenue: 15400
        });
    }, []);

    const cards = [
        { name: "Total Orders", value: stats.orders, icon: FiShoppingBag, color: "bg-blue-500" },
        { name: "Total Customers", value: stats.users, icon: FiUsers, color: "bg-green-500" },
        { name: "Total Products", value: stats.products, icon: FiBox, color: "bg-purple-500" },
        { name: "Total Revenue", value: `$${stats.revenue}`, icon: FiTrendingUp, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back to your admin panel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl text-white ${card.color}`}>
                            <card.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.name}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-center py-10">
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
}

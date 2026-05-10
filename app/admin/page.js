"use client";

import { useState } from "react";

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("adminToken", data.token);

            if (data.isTempPassword) {
                window.location.href = "/admin/settings";
            } else {
                window.location.href = "/admin/dashboard";
            }
        } else {
            setMessage(data.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl w-full max-w-md">

                <h1 className="text-xl font-bold mb-5">Admin Login</h1>

                <input
                    placeholder="Username or Phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                    type="password"
                    placeholder="Password / Temp Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border mb-3"
                />

                <button className="w-full bg-black text-white p-3">
                    {loading ? "Checking..." : "Login"}
                </button>

                {/* 🔥 Forgot password link */}
                <p className="text-center mt-3 text-sm">
                    <a href="/admin/forgot-password" className="text-blue-500">
                        Forgot Password?
                    </a>
                </p>

                {message && (
                    <p className="mt-3 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

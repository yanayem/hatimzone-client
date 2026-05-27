"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check if setup is needed
    useEffect(() => {
        const controller = new AbortController();
        const checkSetup = async () => {
            try {
                const res = await fetch("/api/admin/setup", { signal: controller.signal });
                const data = await res.json();
                if (data.success && data.count === 0) {
                    router.push("/admin/setup");
                }
            } catch (e) {
                if (e.name !== 'AbortError') console.error("Setup check error:", e);
            }
        };
        checkSetup();
        return () => controller.abort();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Cookie is set by the server automatically (httpOnly)
                // No need for localStorage — redirect to dashboard
                router.replace("/admin/dashboard");
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Login failed. Please try again.");
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        <span className="text-green-600">HatimZone</span> Admin
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Sign in to manage your store</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full text-gray-800 placeholder:text-gray-300 p-4 bg-gray-50 border border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-gray-800 placeholder:text-gray-300 p-4 bg-gray-50 border border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold"
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-green-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? "Verifying..." : "Access Dashboard"}
                    </button>

                    {message && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-pulse">
                            {message}
                        </div>
                    )}
                </form>

                <p className="text-center mt-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} HatimZone. All rights reserved.
                </p>
            </div>
        </div>
    );
}

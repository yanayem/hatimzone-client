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
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("adminToken", data.token);
                router.push("/admin/dashboard");
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl w-full max-w-md">

                <h1 className="text-xl text-gray-800 font-bold mb-5">Admin Login</h1>

                <input
                    type="email"
                    placeholder="Email Address"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full text-gray-800 placeholder:text-gray-600 p-4 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black outline-none"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-gray-800 placeholder:text-gray-600 p-4 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black outline-none"
                />

                <button className="w-full bg-black text-white p-3">
                    {loading ? "Checking..." : "Login"}
                </button>

                {/* 🔥 Forgot password link */}
                {/* <p className="text-center mt-3 text-sm">
                    <Link href="/admin/forgot-password" title="Forgot Password" id="forgot-password-link" className="text-blue-500 hover:underline">
                        Forgot Password?
                    </Link>
                </p> */}

                {message && (
                    <p className="mt-3 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

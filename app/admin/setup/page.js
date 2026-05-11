"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetup() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const controller = new AbortController();
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/admin/setup", { signal: controller.signal });
                const data = await res.json();
                if (data.success && data.count > 0) {
                    router.push("/admin");
                } else {
                    setChecking(false);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError("Failed to check system status");
                    setChecking(false);
                }
            }
        };
        checkStatus();
        return () => controller.abort();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
                setTimeout(() => router.push("/admin"), 2000);
            } else {
                setError(data.message || "Setup failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (checking) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 animate-pulse">Checking system status...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase">Initial Setup</h1>
                    <p className="text-gray-500 text-sm">Create the primary administrator account</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold border border-green-100">
                            {message}
                        </div>
                    )}

                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all text-gray-800"
                            onChange={(e) => setForm({...form, email: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all text-gray-800"
                                onChange={(e) => setForm({...form, password: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Confirm"
                                required
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all text-gray-800"
                                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-gray-200"
                    >
                        {loading ? "INITIALIZING..." : "CREATE ADMIN ACCOUNT"}
                    </button>
                </form>
            </div>
        </div>
    );
}

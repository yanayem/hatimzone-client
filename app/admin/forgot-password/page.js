"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!phone) {
            setError("Please enter your phone number");
            return;
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Enter your phone to get a temp password</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                        <input
                            placeholder="e.g. 01700000000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full bg-black text-white p-4 rounded-2xl mt-8 font-bold shadow-lg shadow-gray-200 hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                    {loading ? "Generating..." : "Generate Temp Password"}
                </button>

                {message && (
                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-sm font-medium leading-relaxed">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a href="/admin" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

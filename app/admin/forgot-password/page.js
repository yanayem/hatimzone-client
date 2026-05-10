"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        
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
                setResetDone(true);
                setPhone("");
            } else {
                setError(data.message || "Failed to reset password");
                setResetDone(false);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setResetDone(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">🔐</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 mt-3">Enter your phone number to reset your password</p>
                </div>

                {!resetDone ? (
                    <form onSubmit={handleReset} className="space-y-5">
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">
                                📱 Phone Number
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 01700000000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                                className="w-full text-gray-800 placeholder:text-gray-600 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !phone}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                        >
                            {loading ? "🔄 Checking..." : "✓ Reset Password"}
                        </button>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="space-y-5">
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                            <p className="text-green-800 font-bold text-lg mb-3">✅ Password Reset Successful!</p>
                            <p className="text-green-700 text-sm whitespace-pre-line">{message}</p>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
                            <p className="text-blue-900 font-bold text-sm mb-2">📝 Next Steps:</p>
                            <p className="text-blue-800 text-sm">
                                Please log in using your phone number and the new password.
                            </p>
                        </div>

                        <button
                            onClick={() => setResetDone(false)}
                            className="w-full bg-gray-200 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                        >
                            Reset Another Account
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center pt-6 border-t border-gray-200">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-700 transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}


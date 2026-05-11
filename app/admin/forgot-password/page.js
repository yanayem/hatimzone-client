"use client";

import { useState } from "react";
import Link from "next/link";

export default function SimpleForgotPassword() {
    const [email, setEmail] = useState("");
    const [resetStarted, setResetStarted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResetStarted(false);

        try {
            const res = await fetch("/api/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setResetStarted(true);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm mb-8">Enter your email to get a temp-password in you mail</p>

                {!resetStarted ? (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-black text-gray-800"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white p-4 rounded-2xl font-black hover:bg-gray-900 transition-all disabled:opacity-50"
                        >
                            {loading ? "SENDING..." : "SEND TEMP PASSWORD"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                            <p className="text-green-700 text-sm font-bold">✅ REQUEST SENT</p>
                        </div>

                        <p className="text-gray-500 text-xs text-center leading-relaxed">
                            Please check your inbox for the temporary password. You will be asked to change it immediately after logging in.
                        </p>

                        <Link 
                            href="/admin"
                            className="block w-full bg-black text-white p-4 rounded-2xl font-black text-center hover:bg-gray-900 transition-all shadow-lg"
                        >
                            GO TO LOGIN
                        </Link>
                    </div>
                )}

                <div className="mt-8 text-center border-t pt-6">
                    <Link href="/admin" className="text-sm text-gray-400 font-bold hover:text-black transition-all">
                        ← BACK TO LOGIN
                    </Link>
                </div>
            </div>
        </div>
    );
}

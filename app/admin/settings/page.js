"use client";

import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // FETCH CURRENT ADMIN DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/verify");
                const data = await res.json();

                if (data.success) {
                    setEmail(data.admin.email || "");
                } else {
                    setError(data.message || "Failed to load data");
                }
            } catch (err) {
                setError("Server error while loading data");
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, []);

    // UPDATE HANDLER
    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        // password validation only if user enters password
        if (password) {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (password.length < 4) {
                setError("Password too short");
                return;
            }
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password: password || null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("Profile updated successfully!");
                
                if (data.admin) {
                    setEmail(data.admin.email);
                }

                // clear password fields after success
                setPassword("");
                setConfirmPassword("");
            } else {
                setError(data.message || "Update failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <form
                onSubmit={handleUpdate}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md"
            >
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Admin Settings
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm font-bold">
                        {message}
                    </div>
                )}
                
                {/* EMAIL */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-gray-800 placeholder:text-gray-600 p-4 border rounded-2xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                <hr className="my-6 border-gray-100" />

                {/* PASSWORD */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">New Password</label>
                    <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-gray-800 p-4 border rounded-2xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full text-gray-800 p-4 border rounded-2xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-4 rounded-2xl font-black text-lg shadow-xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? "SAVING..." : "UPDATE SETTINGS"}
                </button>
            </form>
        </div>
    );
}

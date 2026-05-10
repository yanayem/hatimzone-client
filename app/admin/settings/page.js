"use client";

import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");

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
                    setUsername(data.admin.username || "");
                    setPhone(data.admin.phone || "");
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
                    username,
                    phone,
                    password: password || null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("Profile updated successfully!");
                
                // update local state with server data
                if (data.admin) {
                    setUsername(data.admin.username);
                    setPhone(data.admin.phone);
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

    // LOADING UI
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
                <h1 className="text-2xl text-gray-800 font-bold mb-1 text-center">
                    Admin Settings
                </h1>
                <p className="text-xs text-gray-400 text-center mb-6 font-medium uppercase tracking-wider">
                    Current: {username} • {phone}
                </p>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}
                {message && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm">
                        {message}
                    </div>
                )}

                {/* USERNAME */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Username</label>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-gray-800 placeholder:text-gray-600 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* PHONE */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Phone Number</label>
                    <input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                <hr className="my-4 border-gray-100" />

                {/* PASSWORD */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">New Password</label>
                    <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded-xl font-bold disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Update Settings"}
                </button>
            </form>
        </div>
    );
}

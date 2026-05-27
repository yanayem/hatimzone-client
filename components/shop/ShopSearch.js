"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

export default function ShopSearch({ initialQuery = "" }) {
    const [query, setQuery] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const wrapperRef = useRef(null);

    // Debounce search URL update
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set("q", query);
            } else {
                params.delete("q");
            }
            params.set("page", "1"); // Reset to page 1 on search
            router.push(`/shop?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
    }, [query, router, searchParams]);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.success) {
                    setSuggestions(data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch suggestions");
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectSuggestion = (name) => {
        setQuery(name);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="w-full lg:w-[400px] relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-gray-900 font-bold outline-none transition-all text-sm md:text-sm shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button 
                            onClick={() => {setQuery(""); setSuggestions([]);}}
                            className="text-gray-600 hover:text-black transition"
                        >
                            <HiOutlineX className="w-4 h-4" />
                        </button>
                    )}
                    <HiOutlineSearch className="w-5 h-5 text-gray-600" />
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                    {suggestions.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelectSuggestion(item.name)}
                            className="w-full text-left px-6 py-4 text-sm font-bold text-gray-800 hover:bg-gray-50 border-b border-gray-50 last:border-none transition flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                <img src={item.cover || "https://placehold.co/100"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span className="line-clamp-1">{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

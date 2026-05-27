"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products", { signal: controller.signal });
        const data = await res.json();

        if (data.success) {
          // The new API structure returns items inside a 'data' object
          // Support both data.products (old) and data.data.items (new) for compatibility
          const productList = data.data?.items || data.products || [];
          setProducts(productList);
        } else {
          setError(data.message || "Failed to load products");
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
    // || p.category?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products Inventory</h1>
          <p className="text-gray-500">View and manage your store stock ({filteredProducts.length} items)</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 text-[12px] md:text-base rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black transition bg-white text-gray-800 placeholder:text-gray-600 w-full md:w-64"
          />
          <Link href="/admin/products/add">
            <button className="bg-black text-white px-6 py-3 text-[12px] md:text-base rounded-xl font-bold hover:bg-gray-800 transition shadow-lg whitespace-nowrap">
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Table/Card View */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-600 uppercase text-[11px] font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="3" className="px-8 py-8 h-20 bg-gray-50/10"></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-gray-600 font-medium">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          {product.cover ? (
                            <img src={product.cover} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🖼️</div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">ID: {product._id.substring(18)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-base font-black text-gray-900">
                        ৳{product.price}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-xl"></div>
                   <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                   </div>
                </div>
             ))
          ) : filteredProducts.length === 0 ? (
             <div className="p-10 text-center text-gray-600 italic">No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                    {product.cover ? (
                      <img src={product.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🖼️</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-lg font-black text-green-600 mt-1">৳{product.price}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="p-3 bg-gray-50 text-gray-900 rounded-xl transition shadow-sm border border-gray-100 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl transition shadow-sm border border-red-100 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

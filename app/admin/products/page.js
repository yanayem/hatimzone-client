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
            className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black transition bg-white text-gray-800 placeholder:text-gray-600 w-full md:w-64"
          />
          <Link href="/admin/products/add">
            <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg whitespace-nowrap">
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

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-extrabold tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">Product Info</th>
                <th className="px-6 py-5">Price</th>
                {/* <th className="px-6 py-5">Discount Price</th> */}
               {/* <th className="px-6 py-5">Stock Value</th> */}
                {/* <th className="px-6 py-5">Category & Tags</th> */}
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 animate-pulse">
                    Loading your inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition group">

                    {/* 1. Image with Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          {product.cover ? (
                            <img src={product.cover} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🖼️</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">ID: {product._id.substring(18)}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Original Price */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-800">
                        ৳{product.price}
                      </span>
                    </td>

                    {/* 3. Discount Price - Commented Out */}
                    {/* <td className="px-6 py-4">
                      {product.discountPrice > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-green-600">${product.discountPrice}</span>
                          <span className="text-[9px] font-bold text-green-500 uppercase">
                            Saved {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No discount</span>
                      )}
                    </td> */}

                    {/* 4. Stock Value 
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-sm font-bold ${product.stockQuantity > 5 ? 'text-gray-800' : product.stockQuantity > 0 ? 'text-orange-500' : 'text-red-500'
                          }`}>
                          {product.stockQuantity} Pcs
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase ${product.stockStatus === 'In Stock' ? 'text-blue-500' : 'text-red-400'
                          }`}>
                          {product.stockStatus}
                        </span>
                      </div>
                    </td>
                    */}

                    {/* 5. Category & Tags - Commented Out */}
                    {/* <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">{product.category}</span>
                          {product.subCategory && (
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">{product.subCategory}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-purple-50 text-purple-600 border border-purple-100 uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td> */}

                    {/* 6. Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

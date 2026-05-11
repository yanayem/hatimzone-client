"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSub, setNewSub] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCategory("");
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  const handleAddSubCategory = async (catId, subs) => {
    if (!newSub.trim()) return;
    const updatedSubs = [...subs, newSub.trim()];
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subCategories: updatedSubs }),
      });
      if (res.ok) {
        setNewSub("");
        fetchCategories();
      }
    } catch (err) {
      alert("Error adding subcategory");
    }
  };

  const handleRemoveSubCategory = async (catId, subs, subToRemove) => {
    const updatedSubs = subs.filter((s) => s !== subToRemove);
    try {
      await fetch(`/api/admin/categories/${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subCategories: updatedSubs }),
      });
      fetchCategories();
    } catch (err) {
      alert("Error removing subcategory");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
          <p className="text-gray-500">Control your product categories and sub-categories</p>
        </div>

        {/* ADD NEW */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <h2 className="text-lg font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Home Furniture"
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-gray-800"
            />
            <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              Create Category
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">{cat.name}</h3>
                <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 text-sm font-bold hover:underline">
                  Delete Category
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {cat.subCategories?.map((sub, i) => (
                    <div key={i} className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                      <span className="text-sm font-medium text-gray-700">{sub}</span>
                      <button 
                        onClick={() => handleRemoveSubCategory(cat._id, cat.subCategories, sub)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add sub-category (e.g. Chair)"
                    className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:border-black text-gray-800"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubCategory(cat._id, cat.subCategories);
                      }
                    }}
                    onChange={(e) => setNewSub(e.target.value)}
                  />
                  <button 
                    onClick={() => handleAddSubCategory(cat._id, cat.subCategories)}
                    className="text-sm font-bold bg-gray-50 px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesAdminPage;

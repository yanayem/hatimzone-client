"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stockQuantity: "",
    stockStatus: "In Stock",
    sizes: "",
    tags: [],
    isNewArrival: false,
    isTopSelling: false,
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableTags = ["Best Deal", "Limited Edition", "Special Offer", "Summer Collection", "Winter Collection"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Please upload at least one image");
      setLoading(false);
      return;
    }

    try {
      const base64Images = await Promise.all(images.map((img) => fileToBase64(img)));

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: base64Images,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Product added successfully!");
        setTimeout(() => router.push("/admin/products"), 2000);
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-500">Configure your product listings and marketing flags</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100">{success}</div>}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-black rounded-full"></span> General Information
            </h3>
            
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product Title</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Premium Leather Boots"
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product features..."
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              ></textarea>
            </div>
          </div>

          {/* Marketing Flags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-black"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">New Arrival</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="isTopSelling"
                    checked={formData.isTopSelling}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-black"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">Top Selling</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-black"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">Featured Product</span>
             </label>
          </div>

          {/* Section 2: Pricing & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Original Price</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="100.00"
                  className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl pl-8 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sale Price</label>
                {formData.price > 0 && formData.discountPrice > 0 && formData.discountPrice < formData.price && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        SAVE {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}%
                    </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="80.00"
                  className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl pl-8 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Footwear"
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Section 3: Stock & Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                required
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="50"
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Status</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black bg-white transition"
              >
                <option value="In Stock" className="text-gray-800">In Stock</option>
                <option value="Out of Stock" className="text-gray-800">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Sizes</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Section 4: Tags */}
          <div>
            <label className="block mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Additional Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    formData.tags.includes(tag)
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Media */}
          <div>
            <label className="block mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Product Images</label>
            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl px-4 py-10 bg-gray-50 flex flex-col items-center justify-center group-hover:border-black transition">
                <span className="text-3xl mb-2">🖼️</span>
                <span className="font-bold text-gray-800">Click to upload images</span>
                <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</span>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-extrabold text-lg shadow-2xl hover:bg-gray-900 active:scale-[0.99] transition disabled:opacity-50"
            >
              {loading ? "📦 Processing..." : "🚀 Publish Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
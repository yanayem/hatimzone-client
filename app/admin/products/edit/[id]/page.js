"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

const EditProductPage = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  
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
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableTags = ["Featured", "Top Selling", "New Arrival", "Best Deal", "Limited Edition"];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setFormData({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            discountPrice: p.discountPrice || "",
            category: p.category || "",
            stockQuantity: p.stockQuantity || "",
            stockStatus: p.stockStatus || "In Stock",
            sizes: p.sizes ? p.sizes.join(", ") : "",
            tags: p.tags || [],
          });
          setImagePreviews(p.images || []);
          // Note: we don't set 'images' (File objects) for existing images
        } else {
          setError(data.message || "Failed to load product");
        }
      } catch (err) {
        setError("Error loading product data");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // If it's a new image file
    if (index >= imagePreviews.length - images.length) {
        const fileIndex = index - (imagePreviews.length - images.length);
        setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }
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

    try {
      // Process only NEW images
      const base64NewImages = await Promise.all(images.map((img) => fileToBase64(img)));
      
      // Keep existing images that weren't removed
      const existingImages = imagePreviews.filter(url => typeof url === 'string' && url.startsWith('data:image'));
      // Note: In our current setup, all images are base64 strings in the DB
      // If we had external URLs, they would be kept here too.

      const allImages = [...existingImages, ...base64NewImages];

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT", // Need to implement PUT in API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: allImages,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center animate-pulse">Loading Product Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 max-w-4xl mx-auto flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-500">Update details for {formData.name}</p>
        </div>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-black transition">✕ Close</button>
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

          {/* Section 2: Pricing & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Original Price</label>
              </div>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
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
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
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
                placeholder="S, M, L"
                className="w-full text-gray-800 placeholder:text-gray-600 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Section 4: Tags */}
          <div>
            <label className="block mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Product Tags</label>
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
                <span className="font-bold text-gray-800">Add more images</span>
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
              {loading ? "📦 Updating..." : "💾 Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProductPage;

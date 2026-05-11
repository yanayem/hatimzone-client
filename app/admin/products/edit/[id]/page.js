"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

const EditProductPage = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "Generic",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    stockQuantity: "",
    stockStatus: "In Stock",
    tags: [],
    material: "Solid Wood / Laminated Board",
    warranty: "1 Year Service Warranty",
    isNewArrival: false,
    isTopSelling: false,
    isFeatured: false,
  });

  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [deliveryCost, setDeliveryCost] = useState({ insideDhaka: 60, outsideDhaka: 120 });
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const availableTags = ["Best Deal", "Limited Edition", "Special Offer", "Summer Collection", "Winter Collection"];

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
            brand: p.brand || "Generic",
            description: p.description || "",
            price: p.price || "",
            discountPrice: p.discountPrice || "",
            category: p.category || "",
            subCategory: p.subCategory || "",
            stockQuantity: p.stockQuantity || "",
            stockStatus: p.stockStatus || "In Stock",
            tags: p.tags || [],
            material: p.material || "Solid Wood / Laminated Board",
            warranty: p.warranty || "1 Year Service Warranty",
            isNewArrival: p.isNewArrival || false,
            isTopSelling: p.isTopSelling || false,
            isFeatured: p.isFeatured || false,
          });
          
          setDimensions(p.dimensions || { length: "", width: "", height: "" });
          setDeliveryCost(p.deliveryCost || { insideDhaka: 60, outsideDhaka: 120 });

          if (p.specifications) {
            const specArray = Object.entries(p.specifications).map(([key, value]) => ({ key, value }));
            setSpecifications(specArray.length > 0 ? specArray : [{ key: "", value: "" }]);
          } else {
            setSpecifications([{ key: "", value: "" }]);
          }

          setImagePreviews(p.images || []);
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

    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      
      // Auto-reset subcategory when category changes (only if it's a manual change, not initial load)
      if (name === "category") {
        updated.subCategory = "";
      }
      
      return updated;
    });
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryCost(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpec = () => setSpecifications([...specifications, { key: "", value: "" }]);
  const removeSpec = (index) => setSpecifications(specifications.filter((_, i) => i !== index));

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
      const base64NewImages = await Promise.all(images.map((img) => fileToBase64(img)));
      const existingImages = imagePreviews.filter(url => typeof url === 'string' && url.startsWith('data:image'));
      const allImages = [...existingImages, ...base64NewImages];

      const specsObj = {};
      specifications.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dimensions,
          deliveryCost,
          specifications: specsObj,
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

  if (fetching) return <div className="p-20 text-center animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 max-w-4xl mx-auto flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-500">Update full specs and dimensions</p>
        </div>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-black transition">✕ Close</button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100">{success}</div>}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-black rounded-full"></span> General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product Title</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Minimalist Wooden Chair" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition" />
                </div>
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Brand Name</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Hatim Furniture" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition" />
                </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} placeholder="Enter a detailed description of the product..." className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition"></textarea>
            </div>
          </div>

          {/* Material & Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Material</label>
                <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition" />
            </div>
            <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Warranty</label>
                <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition" />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span> Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Length</label>
                    <input type="text" name="length" value={dimensions.length} onChange={handleDimensionChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-black transition" />
                </div>
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Width</label>
                    <input type="text" name="width" value={dimensions.width} onChange={handleDimensionChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-black transition" />
                </div>
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Height</label>
                    <input type="text" name="height" value={dimensions.height} onChange={handleDimensionChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-black transition" />
                </div>
            </div>
          </div>

          {/* Shipping Cost */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Shipping Costs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Inside Dhaka</label>
                    <input type="number" name="insideDhaka" value={deliveryCost.insideDhaka} onChange={handleDeliveryChange} placeholder="60" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-black transition" />
                </div>
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Outside Dhaka</label>
                    <input type="number" name="outsideDhaka" value={deliveryCost.outsideDhaka} onChange={handleDeliveryChange} placeholder="120" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-black transition" />
                </div>
            </div>
          </div>

          {/* Marketing Flags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-5 h-5 rounded accent-black" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">New Arrival</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isTopSelling" checked={formData.isTopSelling} onChange={handleChange} className="w-5 h-5 rounded accent-black" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">Top Selling</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded accent-black" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">Featured</span>
             </label>
          </div>

          {/* Pricing & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Price</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="5000" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Sale Price</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="4500" className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition bg-white">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-Category</label>
                <select name="subCategory" required value={formData.subCategory} onChange={handleChange} className="w-full text-gray-800 border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition bg-white">
                  <option value="">Select Sub-Category</option>
                  {categories.find(c => c.name === formData.category)?.subCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Other Specifications
                </h3>
                <button type="button" onClick={addSpec} className="text-xs font-bold text-blue-600 hover:underline">+ Add Row</button>
            </div>
            <div className="space-y-3">
                {specifications.map((spec, i) => (
                    <div key={i} className="flex gap-3 items-center">
                        <input type="text" placeholder="Key" value={spec.key} onChange={(e) => handleSpecChange(i, "key", e.target.value)} className="flex-1 text-gray-800 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none" />
                        <input type="text" placeholder="Value" value={spec.value} onChange={(e) => handleSpecChange(i, "value", e.target.value)} className="flex-1 text-gray-800 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none" />
                        <button type="button" onClick={() => removeSpec(i)} className="text-red-400 p-2">✕</button>
                    </div>
                ))}
            </div>
          </div>

          {/* Media */}
          <div>
            <label className="block mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Images</label>
            <div className="relative group">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl px-4 py-10 bg-gray-50 flex flex-col items-center justify-center group-hover:border-black transition">
                <span className="font-bold text-gray-800">Add more images</span>
              </div>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px]">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-extrabold text-lg shadow-2xl hover:bg-gray-900 transition disabled:opacity-50">
            {loading ? "📦 Updating..." : "💾 Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProductPage;

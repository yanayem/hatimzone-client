"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    stockQuantity: "",
    material: "",
    color: "",
    bulbType: "",
    wattage: "",
    powerSource: "",
    warranty: "",
    isNewArrival: false,
    isTopSelling: false,
    isFeatured: false,
  });

  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [deliveryCost, setDeliveryCost] = useState({ insideDhaka: 60, outsideDhaka: 120 });
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [variants, setVariants] = useState([{ size: "", color: "", material: "", stock: 0, additionalPrice: 0 }]);
  const [usageInstructions, setUsageInstructions] = useState([""]);
  const [videos, setVideos] = useState([""]);
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "category") updated.subCategory = "";
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

  // Generic List Handlers
  const handleListChange = (index, value, setter) => {
    setter(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addListItem = (setter, defaultValue = "") => setter(prev => [...prev, defaultValue]);
  const removeListItem = (index, setter) => setter(prev => prev.filter((_, i) => i !== index));

  // Variants Handler
  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index][field] = field === 'stock' || field === 'additionalPrice' ? Number(value) : value;
      return updated;
    });
  };

  // Specs Handler
  const handleSpecChange = (index, field, value) => {
    setSpecifications(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
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
      
      const specsObj = {};
      specifications.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice || 0),
          stockQuantity: Number(formData.stockQuantity || 0),
          dimensions,
          deliveryCost,
          specifications: specsObj,
          variants: variants.filter(v => v.size || v.color || v.material),
          usageInstructions: usageInstructions.filter(i => i.trim()),
          videos: videos.filter(v => v.trim()),
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
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="mb-8 max-w-5xl mx-auto flex justify-between items-end border-b pb-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">New Collection</h1>
            <p className="text-gray-500 font-medium">Add a premium product to your inventory</p>
        </div>
        <button onClick={() => router.back()} className="bg-white border p-3 rounded-2xl hover:bg-gray-50 transition shadow-sm font-bold text-gray-400 hover:text-black flex items-center gap-2">✕ Close</button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-3xl text-sm font-bold border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-3xl text-sm font-bold border border-green-100">{success}</div>}

                {/* BASIC INFO */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-8 bg-black rounded-full"></span> Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Product Title</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Modern Glass Chandelier" className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Hatim Furniture" className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Warranty</label>
                            <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="e.g. 5 Years Warranty" className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium" />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea name="description" required rows="6" value={formData.description} onChange={handleChange} placeholder="Detailed product story..." className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium"></textarea>
                    </div>
                </section>

                {/* TECHNICAL SPECS */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span> Technical Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. Solid Wood" className="w-full text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Bulb Type</label>
                            <input type="text" name="bulbType" value={formData.bulbType} onChange={handleChange} placeholder="e.g. LED" className="w-full text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Wattage</label>
                            <input type="text" name="wattage" value={formData.wattage} onChange={handleChange} placeholder="e.g. 60W" className="w-full text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Power Source</label>
                            <input type="text" name="powerSource" value={formData.powerSource} onChange={handleChange} placeholder="e.g. AC Adapter" className="w-full text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none" />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Color</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Matte Black" className="w-full text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none" />
                        </div>
                    </div>
                </section>

                {/* VARIANTS */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-500 rounded-full"></span> Variants (Size/Color)
                        </h3>
                        <button type="button" onClick={() => addListItem(setVariants, { size: "", color: "", material: "", stock: 0, additionalPrice: 0 })} className="text-xs font-black bg-purple-50 text-purple-600 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-purple-100 transition">+ Add Variant</button>
                    </div>
                    <div className="space-y-4">
                        {variants.map((v, i) => (
                            <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-2xl relative">
                                <input placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, 'size', e.target.value)} className="bg-white rounded-xl px-3 py-2 text-sm outline-none" />
                                <input placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)} className="bg-white rounded-xl px-3 py-2 text-sm outline-none" />
                                <input placeholder="Material" value={v.material} onChange={(e) => handleVariantChange(i, 'material', e.target.value)} className="bg-white rounded-xl px-3 py-2 text-sm outline-none" />
                                <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className="bg-white rounded-xl px-3 py-2 text-sm outline-none" />
                                <input type="number" placeholder="+Price" value={v.additionalPrice} onChange={(e) => handleVariantChange(i, 'additionalPrice', e.target.value)} className="bg-white rounded-xl px-3 py-2 text-sm outline-none" />
                                <button type="button" onClick={() => removeListItem(i, setVariants)} className="absolute -top-2 -right-2 bg-white text-red-500 w-6 h-6 rounded-full shadow-sm border flex items-center justify-center text-xs">✕</button>
                            </div>
                        ))}
                    </div>
                </section>

                <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50">
                    {loading ? "📦 SYNCING DATABASE..." : "🚀 PUBLISH TO STORE"}
                </button>
            </form>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
            {/* PRICING */}
            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 opacity-50">Pricing & Stock</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Base Price (BDT)</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full bg-white/10 border-0 rounded-2xl px-5 py-4 text-2xl font-black outline-none focus:ring-2 focus:ring-white/20" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Discounted Price</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="0.00" className="w-full bg-white/10 border-0 rounded-2xl px-5 py-4 text-2xl font-black outline-none focus:ring-2 focus:ring-white/20 text-green-400" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Total Stock</label>
                        <input type="number" name="stockQuantity" required value={formData.stockQuantity} onChange={handleChange} placeholder="0" className="w-full bg-white/10 border-0 rounded-2xl px-5 py-4 text-xl font-black outline-none" />
                    </div>
                </div>
            </div>

            {/* CATEGORIES */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Category Select</h3>
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Main Category</label>
                    <select name="category" required value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Sub-Category</label>
                    <select name="subCategory" required value={formData.subCategory} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none">
                        <option value="">Select Sub</option>
                        {categories.find(c => c.name === formData.category)?.subCategories.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* MEDIA */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 text-center">Visual Assets</h3>
                <div className="relative group">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full border-2 border-dashed border-gray-100 rounded-3xl py-10 flex flex-col items-center justify-center group-hover:border-black transition bg-gray-50">
                        <span className="text-4xl mb-2">📸</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add Gallery</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold">✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* MARKETING */}
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Visibility Flags</h3>
                {[
                    { name: 'isNewArrival', label: 'New Arrival', color: 'bg-blue-500' },
                    { name: 'isTopSelling', label: 'Top Selling', color: 'bg-orange-500' },
                    { name: 'isFeatured', label: 'Featured', color: 'bg-purple-500' }
                ].map(flag => (
                    <label key={flag.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition">
                        <span className="text-xs font-bold">{flag.label}</span>
                        <input type="checkbox" name={flag.name} checked={formData[flag.name]} onChange={handleChange} className="w-5 h-5 rounded accent-white" />
                    </label>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
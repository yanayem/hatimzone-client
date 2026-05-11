"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const EditProductPage = () => {
  const router = useRouter();
  const { id } = useParams();
  
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
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/admin/categories");
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories);

        // Fetch Product
        const prodRes = await fetch(`/api/admin/products/${id}`);
        const prodData = await prodRes.json();
        if (prodData.success) {
            const p = prodData.product;
            setFormData({
                name: p.name || "",
                brand: p.brand || "",
                description: p.description || "",
                price: p.price || "",
                discountPrice: p.discountPrice || "",
                category: p.category || "",
                subCategory: p.subCategory || "",
                stockQuantity: p.stockQuantity || "",
                material: p.material || "",
                color: p.color || "",
                bulbType: p.bulbType || "",
                wattage: p.wattage || "",
                powerSource: p.powerSource || "",
                warranty: p.warranty || "",
                isNewArrival: !!p.isNewArrival,
                isTopSelling: !!p.isTopSelling,
                isFeatured: !!p.isFeatured,
            });
            setDimensions(p.dimensions || { length: "", width: "", height: "" });
            setDeliveryCost(p.deliveryCost || { insideDhaka: 60, outsideDhaka: 120 });
            
            const specs = Object.entries(p.specifications || {}).map(([key, value]) => ({ key, value }));
            setSpecifications(specs.length > 0 ? specs : [{ key: "", value: "" }]);
            
            setVariants(p.variants?.length > 0 ? p.variants : [{ size: "", color: "", material: "", stock: 0, additionalPrice: 0 }]);
            setUsageInstructions(p.usageInstructions?.length > 0 ? p.usageInstructions : [""]);
            setVideos(p.videos?.length > 0 ? p.videos : [""]);
            setExistingImages(p.images || []);
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
        const updated = [...prev];
        updated[index][field] = field === 'stock' || field === 'additionalPrice' ? Number(value) : value;
        return updated;
    });
  };

  const handleSpecChange = (index, field, value) => {
    setSpecifications(prev => {
        const updated = [...prev];
        updated[index][field] = value;
        return updated;
    });
  };

  const addListItem = (setter, defaultValue = "") => setter(prev => [...prev, defaultValue]);
  const removeListItem = (index, setter) => setter(prev => prev.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
    setSaving(true);
    setError("");
    setSuccess("");

    if (images.length === 0 && existingImages.length === 0) {
      setError("Please upload at least one image");
      setSaving(false);
      return;
    }

    try {
      const base64Images = await Promise.all(images.map((img) => fileToBase64(img)));
      
      const specsObj = {};
      specifications.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
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
          images: [...existingImages, ...base64Images],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => router.push("/admin/products"), 2000);
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Syncing...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
       <div className="mb-8 max-w-5xl mx-auto flex justify-between items-end border-b pb-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Edit Product</h1>
            <p className="text-gray-500 font-medium">Update "{formData.name}"</p>
        </div>
        <button onClick={() => router.back()} className="bg-white border p-3 rounded-2xl hover:bg-gray-50 transition shadow-sm font-bold text-gray-400 hover:text-black">✕ Cancel</button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-3xl text-sm font-bold border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-3xl text-sm font-bold border border-green-100">{success}</div>}

                {/* BASIC INFO */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-8 bg-black rounded-full"></span> General Information
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
                            <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="e.g. 1 Year Warranty" className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium" />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea name="description" required rows="6" value={formData.description} onChange={handleChange} placeholder="Detailed product story..." className="w-full text-gray-800 border-0 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition font-medium"></textarea>
                    </div>
                </section>

                {/* VARIANTS */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-500 rounded-full"></span> Variants
                        </h3>
                        <button type="button" onClick={() => addListItem(setVariants, { size: "", color: "", material: "", stock: 0, additionalPrice: 0 })} className="text-xs font-black bg-purple-50 text-purple-600 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-purple-100 transition">+ Add</button>
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

                <button type="submit" disabled={saving} className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50">
                    {saving ? "📦 UPDATING..." : "🚀 SAVE CHANGES"}
                </button>
            </form>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 opacity-50">Pricing & Stock</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Base Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full bg-white/10 border-0 rounded-2xl px-5 py-4 text-2xl font-black outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Total Stock</label>
                        <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" className="w-full bg-white/10 border-0 rounded-2xl px-5 py-4 text-xl font-black outline-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 text-center">Media Assets</h3>
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-gray-400">Existing Images</p>
                    <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold">✕</button>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-[10px] font-black uppercase text-gray-400 pt-4 border-t">Upload New</p>
                    <div className="relative group">
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full border-2 border-dashed border-gray-100 rounded-3xl py-10 flex flex-col items-center justify-center bg-gray-50">
                            <span className="text-2xl">📸</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;

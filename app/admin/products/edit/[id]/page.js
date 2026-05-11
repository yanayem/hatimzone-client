"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  HiOutlinePhotograph, 
  HiOutlineCube, 
  HiOutlineTag, 
  HiOutlineCurrencyBangladeshi,
  HiOutlineInformationCircle,
  HiOutlineTruck,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineSave,
  HiX
} from "react-icons/hi";

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
    tags: "", // Handled as string then split
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
        if (catData.success) {
            setCategories(catData.data || catData.categories || []);
        }

        // Fetch Product
        const prodRes = await fetch(`/api/admin/products/${id}`);
        const prodData = await prodRes.json();
        if (prodData.success) {
            const p = prodData.data || prodData.product;
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
                tags: p.tags?.join(", ") || "",
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
        setError("Failed to load data. Please refresh.");
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
        updated[index][field] = (field === 'stock' || field === 'additionalPrice') ? Number(value) : value;
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

  const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    if (formData.name.trim().length < 3) return "Product title must be at least 3 characters.";
    if (!formData.price || Number(formData.price) <= 0) return "Please enter a valid base price.";
    if (!formData.category) return "Please select a category.";
    if (images.length === 0 && existingImages.length === 0) return "At least one image is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const base64Images = await Promise.all(images.map((img) => fileToBase64(img)));
      
      const specsObj = {};
      specifications.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice || 0),
        stockQuantity: Number(formData.stockQuantity || 0),
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        dimensions,
        deliveryCost,
        specifications: specsObj,
        variants: variants.filter(v => v.size || v.color || v.material),
        usageInstructions: usageInstructions.filter(i => i.trim()),
        videos: videos.filter(v => v.trim()),
        images: [...existingImages, ...base64Images],
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Product saved successfully!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setError(data.message || "Failed to save changes.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-black font-black uppercase tracking-widest text-xs">Syncing Product Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-40 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-black text-black tracking-tighter uppercase">Edit Collection</h1>
                <p className="text-gray-500 text-sm font-bold">Managing: {formData.name || "Untitled Product"}</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => router.back()} className="px-6 py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:text-black hover:border-black transition">Cancel</button>
                <button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-8 py-3 bg-black text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-xl"
                >
                    <HiOutlineSave className="text-xl" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN - MAIN FORM */}
        <div className="lg:col-span-8 space-y-10">
            
            {error && <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border-2 border-red-100 font-bold flex items-center gap-3"><HiX className="text-xl" /> {error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-6 rounded-[2rem] border-2 border-green-100 font-bold">🎉 {success}</div>}

            {/* 1. BASIC INFORMATION */}
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center"><HiOutlineInformationCircle className="text-xl" /></div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">Core Details</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. Premium Leather Sofa" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Brand</label>
                            <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. Hatim Zone" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Warranty</label>
                            <input name="warranty" value={formData.warranty} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. 5 Years" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="Tell the product's story..."></textarea>
                    </div>
                </div>
            </section>

            {/* 2. SPECIFICATIONS (DETAILED SYNC WITH MODEL) */}
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center"><HiOutlineCube className="text-xl" /></div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">Technical Specs</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Material</label>
                        <input name="material" value={formData.material} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. Solid Oak" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Color</label>
                        <input name="color" value={formData.color} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. Walnut" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Power Source</label>
                        <input name="powerSource" value={formData.powerSource} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. AC Adapter" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Wattage</label>
                        <input name="wattage" value={formData.wattage} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. 60W" />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <h3 className="text-sm font-black uppercase text-gray-400 mb-4">Custom Attributes</h3>
                    <div className="space-y-4">
                        {specifications.map((s, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <input placeholder="Key (e.g. Fabric)" value={s.key} onChange={(e) => handleSpecChange(i, 'key', e.target.value)} className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 text-black font-bold outline-none border-2 border-transparent focus:border-black" />
                                <input placeholder="Value (e.g. Cotton)" value={s.value} onChange={(e) => handleSpecChange(i, 'value', e.target.value)} className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 text-black font-bold outline-none border-2 border-transparent focus:border-black" />
                                <button type="button" onClick={() => removeListItem(i, setSpecifications)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition"><HiOutlineTrash /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem(setSpecifications, { key: "", value: "" })} className="text-xs font-black text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-blue-100 transition">+ Add Attribute</button>
                    </div>
                </div>
            </section>

            {/* 3. VARIANTS & STOCK */}
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center"><HiOutlineTag className="text-xl" /></div>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Variants</h2>
                    </div>
                    <button type="button" onClick={() => addListItem(setVariants, { size: "", color: "", material: "", stock: 0, additionalPrice: 0 })} className="text-xs font-black text-purple-600 bg-purple-50 px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-purple-100 transition">+ Add Variant</button>
                </div>

                <div className="space-y-4">
                    {variants.map((v, i) => (
                        <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-6 bg-gray-50 rounded-[2rem] relative border border-transparent hover:border-purple-200 transition">
                            <input placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, 'size', e.target.value)} className="bg-white rounded-2xl px-4 py-3 text-black font-bold text-sm outline-none border-2 border-transparent focus:border-purple-500" />
                            <input placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)} className="bg-white rounded-2xl px-4 py-3 text-black font-bold text-sm outline-none border-2 border-transparent focus:border-purple-500" />
                            <input placeholder="Material" value={v.material} onChange={(e) => handleVariantChange(i, 'material', e.target.value)} className="bg-white rounded-2xl px-4 py-3 text-black font-bold text-sm outline-none border-2 border-transparent focus:border-purple-500" />
                            <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className="bg-white rounded-2xl px-4 py-3 text-black font-bold text-sm outline-none border-2 border-transparent focus:border-purple-500" />
                            <input type="number" placeholder="+Price" value={v.additionalPrice} onChange={(e) => handleVariantChange(i, 'additionalPrice', e.target.value)} className="bg-white rounded-2xl px-4 py-3 text-black font-bold text-sm outline-none border-2 border-transparent focus:border-purple-500" />
                            <button type="button" onClick={() => removeListItem(i, setVariants)} className="absolute -top-3 -right-3 bg-white text-red-500 w-8 h-8 rounded-full shadow-lg border-2 flex items-center justify-center hover:bg-red-50 transition">✕</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="lg:col-span-4 space-y-10">
            
            {/* PRICING & CLASSIFICATION */}
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
                <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                    <HiOutlineCurrencyBangladeshi className="text-3xl text-green-400" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Market Values</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                          Original Price (৳) <span className="text-red-500">*</span>
                        </label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white/10 border-2 border-transparent focus:border-green-400 rounded-3xl px-6 py-5 text-3xl font-black text-white outline-none transition" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Discount Price (৳)</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full bg-white/10 border-2 border-transparent focus:border-pink-400 rounded-3xl px-6 py-5 text-3xl font-black text-white outline-none transition" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Inventory Count</label>
                        <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-white/10 border-2 border-transparent focus:border-blue-400 rounded-3xl px-6 py-5 text-3xl font-black text-white outline-none transition" placeholder="0" />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-6 h-6 rounded-lg accent-pink-600" />
                        <span className="text-xs font-black uppercase tracking-widest group-hover:text-pink-400 transition">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isTopSelling" checked={formData.isTopSelling} onChange={handleChange} className="w-6 h-6 rounded-lg accent-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest group-hover:text-blue-400 transition">Top Selling</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-6 h-6 rounded-lg accent-amber-600" />
                        <span className="text-xs font-black uppercase tracking-widest group-hover:text-amber-400 transition">Featured Product</span>
                    </label>
                </div>
            </div>

            {/* CATEGORY SELECT */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xs font-black uppercase text-gray-400 text-center tracking-widest">
                  Classification <span className="text-red-500">*</span>
                </h3>
                <div className="space-y-4">
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-black font-bold outline-none transition appearance-none cursor-pointer">
                        <option value="">Select Category</option>
                        {categories.map((c, i) => (
                            <option key={i} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <input name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-black font-bold outline-none transition" placeholder="Sub-category (e.g. Sofa)" />
                    <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-black font-bold outline-none transition" placeholder="Tags (comma separated)" />
                </div>
            </div>

            {/* GALLERY & MEDIA */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest">
                      Gallery <span className="text-red-500">*</span>
                    </h3>
                    <div className="relative">
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <button className="text-xs font-black bg-black text-white px-4 py-2 rounded-xl">+ Upload</button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {/* EXISTING */}
                    {existingImages.map((img, i) => (
                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border">
                            <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                            <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-xl">✕</button>
                        </div>
                    ))}
                    {/* NEW PREVIEWS */}
                    {imagePreviews.map((img, i) => (
                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-blue-400">
                            <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                            <button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-xl">✕</button>
                            <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">NEW</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SHIPPING & LOGISTICS */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3">
                    <HiOutlineTruck className="text-2xl text-blue-500" />
                    <h3 className="text-lg font-black uppercase text-black tracking-tight">Logistics</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Inside Dhaka (৳)</span>
                        <input type="number" name="insideDhaka" value={deliveryCost.insideDhaka} onChange={handleDeliveryChange} className="w-24 bg-gray-50 rounded-xl px-4 py-3 text-black font-bold text-right" />
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Outside Dhaka (৳)</span>
                        <input type="number" name="outsideDhaka" value={deliveryCost.outsideDhaka} onChange={handleDeliveryChange} className="w-24 bg-gray-50 rounded-xl px-4 py-3 text-black font-bold text-right" />
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* STICKY BOTTOM SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t px-6 py-4 flex justify-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:hidden">
        <button 
            onClick={handleSubmit}
            disabled={saving}
            className="w-full max-w-md bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition"
        >
            <HiOutlineSave className="text-2xl" />
            {saving ? "Syncing..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProductPage;

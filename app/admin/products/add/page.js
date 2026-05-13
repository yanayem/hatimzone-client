"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const AddProductPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
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
    tags: "",
    videoUrl: "",
  });

  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [deliveryCost, setDeliveryCost] = useState({ insideDhaka: 60, outsideDhaka: 120 });
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [variants, setVariants] = useState([{ size: "", color: "", material: "", stock: 0, additionalPrice: 0 }]);
  const [usageInstructions, setUsageInstructions] = useState([""]);
  const [videos, setVideos] = useState([""]);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data || data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
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

  const validateForm = () => {
    if (formData.name.trim().length < 3) return "Product title must be at least 3 characters.";
    if (!formData.price || Number(formData.price) <= 0) return "Please enter a valid base price.";
    if (!cover) return "Please upload a cover image.";
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const base64Images = await Promise.all(images.map((img) => fileToBase64(img)));
      const base64Cover = await fileToBase64(cover);

      const specsObj = {};
      specifications.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice || 0),
        stockQuantity: Math.max(0, Number(formData.stockQuantity || 0)),
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        dimensions,
        deliveryCost,
        specifications: specsObj,
        variants: variants.map(v => ({
          ...v,
          stock: Math.max(0, Number(v.stock || 0)),
          additionalPrice: Math.max(0, Number(v.additionalPrice || 0))
        })).filter(v => v.size || v.color || v.material),
        usageInstructions: usageInstructions.filter(i => i.trim()),
        videos: videos.filter(v => v.trim()),
        images: base64Images,
        cover: base64Cover,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Product published successfully!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setError(data.message || "Failed to add product.");
      }
    } catch (err) {
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-40 px-4 md:px-6 py-4 md:py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase">New Collection</h1>
            <p className="text-gray-500 text-xs md:text-sm font-bold">Add a premium product to your inventory</p>
          </div>
          <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
            <button onClick={() => router.back()} className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 border-2 border-gray-100 rounded-xl md:rounded-2xl font-bold text-gray-400 hover:text-black hover:border-black transition text-sm md:text-base">Close</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3 bg-black text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-xl text-sm md:text-base"
            >
              <HiOutlineSave className="text-lg md:text-xl" />
              {loading ? "..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          {error && <div className="bg-red-50 text-red-600 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-red-100 font-bold flex items-center gap-3 text-sm md:text-base"><HiX className="text-xl" /> {error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-green-100 font-bold text-sm md:text-base">🎉 {success}</div>}

          <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center"><HiOutlineInformationCircle className="text-lg md:text-xl" /></div>
              <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Basic Details</h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g.table-lamp,stand-lamp....." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Brand</label>
                  <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. Hatim Furniture" />
                </div>
                <div>
                  <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Warranty</label>
                  <input name="warranty" value={formData.warranty} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. 5 Years" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                  Description
                </label>
                <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="Tell the product's story..."></textarea>
              </div>

              <div>
                <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                  Video URL (YouTube/Direct)
                </label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. https://youtube.com/watch?v=..." />
              </div>

              <div>
                <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                  Tags / Keywords (Comma separated)
                </label>
                <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="e.g. table-lamp,stand-lamp....." />
              </div>
            </div>
          </section>

          {/* 
            // 2. CATEGORY & INVENTORY
            <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center"><HiOutlineCube className="text-lg md:text-xl" /></div>
                    <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Inventory</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition appearance-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Stock Quantity</label>
                        <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl md:rounded-3xl px-6 py-4 text-black font-bold outline-none transition" placeholder="0" />
                    </div>
                </div>
            </section>

            // 3. VARIANTS
            <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center"><HiOutlineTag className="text-lg md:text-xl" /></div>
                        <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Variants</h2>
                    </div>
                    <button type="button" onClick={() => addListItem(setVariants, { size: "", color: "", material: "", stock: 0, additionalPrice: 0 })} className="text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                        <HiOutlinePlusCircle /> Add Variant
                    </button>
                </div>

                <div className="space-y-4">
                    {variants.map((v, i) => (
                        <div key={i} className="p-4 md:p-6 bg-gray-50 rounded-[2rem] border border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 relative group">
                            <input placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, "size", e.target.value)} className="bg-white px-4 py-2 rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm" />
                            <input placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} className="bg-white px-4 py-2 rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm" />
                            <input placeholder="Price +" type="number" value={v.additionalPrice} onChange={(e) => handleVariantChange(i, "additionalPrice", e.target.value)} className="bg-white px-4 py-2 rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm" />
                            <input placeholder="Stock" type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="bg-white px-4 py-2 rounded-xl border border-transparent focus:border-black outline-none font-bold text-sm" />
                            <button type="button" onClick={() => removeListItem(i, setVariants)} className="bg-white text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl border border-transparent transition flex items-center justify-center"><HiOutlineTrash /></button>
                        </div>
                    ))}
                </div>
            </section>

            // 4. DIMENSIONS
            <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center">📏</div>
                    <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Dimensions</h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Length</label>
                        <input name="length" value={dimensions.length} onChange={(e) => setDimensions({...dimensions, length: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-6 py-4 font-bold outline-none transition" placeholder="e.g. 20cm" />
                    </div>
                    <div>
                        <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Width</label>
                        <input name="width" value={dimensions.width} onChange={(e) => setDimensions({...dimensions, width: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-6 py-4 font-bold outline-none transition" placeholder="e.g. 10cm" />
                    </div>
                    <div>
                        <label className="block text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Height</label>
                        <input name="height" value={dimensions.height} onChange={(e) => setDimensions({...dimensions, height: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-6 py-4 font-bold outline-none transition" placeholder="e.g. 30cm" />
                    </div>
                </div>
            </section>

            // 5. SPECIFICATIONS
            <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center"><HiOutlinePhotograph className="text-lg md:text-xl" /></div>
                        <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Specifications</h2>
                    </div>
                    <button type="button" onClick={() => addListItem(setSpecifications, { key: "", value: "" })} className="text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                        <HiOutlinePlusCircle /> Add Spec
                    </button>
                </div>

                <div className="space-y-4">
                    {specifications.map((s, i) => (
                        <div key={i} className="flex gap-3 md:gap-4">
                            <input placeholder="Label (e.g. Material)" value={s.key} onChange={(e) => handleSpecChange(i, "key", e.target.value)} className="flex-1 bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-black outline-none font-bold text-sm" />
                            <input placeholder="Value (e.g. Oak Wood)" value={s.value} onChange={(e) => handleSpecChange(i, "value", e.target.value)} className="flex-1 bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-black outline-none font-bold text-sm" />
                            <button type="button" onClick={() => removeListItem(i, setSpecifications)} className="bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-4 rounded-2xl border-2 border-transparent transition flex items-center justify-center"><HiOutlineTrash /></button>
                        </div>
                    ))}
                </div>
            </section>

            // 6. USAGE INSTRUCTIONS
            <section className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center">📝</div>
                        <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Usage Instructions</h2>
                    </div>
                    <button type="button" onClick={() => addListItem(setUsageInstructions)} className="text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                        <HiOutlinePlusCircle /> Add Step
                    </button>
                </div>

                <div className="space-y-4">
                    {usageInstructions.map((step, i) => (
                        <div key={i} className="flex gap-3 md:gap-4">
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 shrink-0">{i + 1}</span>
                            <input placeholder="Step description..." value={step} onChange={(e) => {
                                const updated = [...usageInstructions];
                                updated[i] = e.target.value;
                                setUsageInstructions(updated);
                            }} className="flex-1 bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-black outline-none font-bold text-sm" />
                            <button type="button" onClick={() => removeListItem(i, setUsageInstructions)} className="bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-4 rounded-2xl border-2 border-transparent transition flex items-center justify-center"><HiOutlineTrash /></button>
                        </div>
                    ))}
                </div>
            </section>
            */}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 md:space-y-10">
          <div className="bg-gray-100 text-gray-800 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 md:pb-6">
              <HiOutlineCurrencyBangladeshi className="text-2xl md:text-3xl text-green-500" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Market Values</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-black uppercase tracking-widest text-gray-800 mb-2">
                  Original Price (Taka) <span className="text-red-500">*</span>
                </label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-green-400 rounded-2xl md:rounded-3xl px-6 py-4 md:py-5 text-2xl md:text-3xl font-black text-gray-800 outline-none transition" placeholder="0.00" />
              </div>
              {/* 
                    <div>
                        <label className="block text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2">Discount Price (Optional)</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full bg-white border-2 border-transparent focus:border-blue-400 rounded-2xl md:rounded-3xl px-6 py-4 font-bold text-gray-800 outline-none transition" placeholder="0.00" />
                    </div>
                    */}
            </div>

            <div className="pt-4 md:pt-6 border-t border-gray-200 space-y-6">
              {/* 
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <HiOutlineTruck className="text-xl text-blue-500" />
                            <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-400">Shipping Costs</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1">Inside Dhaka</label>
                                <input type="number" name="insideDhaka" value={deliveryCost.insideDhaka} onChange={handleDeliveryChange} className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1">Outside Dhaka</label>
                                <input type="number" name="outsideDhaka" value={deliveryCost.outsideDhaka} onChange={handleDeliveryChange} className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 font-bold text-sm" />
                            </div>
                        </div>
                    </div>
                    */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-5 h-5 md:w-6 md:h-6 rounded-lg accent-pink-600" />
                <span className="text-[12px] md:text-xs font-black uppercase tracking-widest group-hover:text-pink-400 transition">New Arrival</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isTopSelling" checked={formData.isTopSelling} onChange={handleChange} className="w-5 h-5 md:w-6 md:h-6 rounded-lg accent-blue-600" />
                <span className="text-[12px] md:text-xs font-black uppercase tracking-widest group-hover:text-blue-400 transition">Top Selling</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 md:w-6 md:h-6 rounded-lg accent-amber-600" />
                <span className="text-[12px] md:text-xs font-black uppercase tracking-widest group-hover:text-amber-400 transition">Featured</span>
              </label>
            </div>
          </div>

          {/* COVER IMAGE */}
          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-xs md:text-sm font-black uppercase text-gray-400 tracking-widest">
                Cover Image <span className="text-red-500">*</span>
              </h3>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="text-[12px] md:text-xs font-black bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">Select Cover</button>
              </div>
            </div>
            {coverPreview && (
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md border-2 border-blue-100">
                <img src={coverPreview} className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setCover(null); setCoverPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">✕</button>
              </div>
            )}
          </div>

          {/* GALLERY */}
          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-xs md:text-sm font-black uppercase text-gray-400 tracking-widest">
                Gallery
              </h3>
              <div className="relative">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="text-[12px] md:text-xs font-black bg-black text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">+ Add Images</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {imagePreviews.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-sm border">
                  <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-xl">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM SAVE BAR (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t px-6 py-4 flex justify-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] sm:hidden">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition"
        >
          <HiOutlineSave className="text-xl" />
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;

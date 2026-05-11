import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import SortSelect from "@/components/SortSelect";

export default async function ShopPage({ searchParams }) {
  await connectDB();

  const params = await searchParams;

  const selectedCategories = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
    : [];
    
  const selectedSubCategories = params.subCategory
    ? Array.isArray(params.subCategory)
      ? params.subCategory
      : [params.subCategory]
    : [];

  const selectedBrands = params.brand
    ? Array.isArray(params.brand)
      ? params.brand
      : [params.brand]
    : [];

  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const q = params.q || "";
  const sort = params.sort || "newest";
  const page = Number(params.page) || 1;

  const limit = 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (selectedCategories.length)
    filter.category = { $in: selectedCategories };

  if (selectedBrands.length)
    filter.brand = { $in: selectedBrands };

  if (q)
    filter.name = { $regex: q, $options: "i" };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "price-low") sortOption = { price: 1 };
  if (sort === "price-high") sortOption = { price: -1 };

  const [products, totalProducts, categories, brands] =
    await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);

  const getToggleUrl = (key, value) => {
    const newParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((val) => newParams.append(k, val));
      else newParams.set(k, v);
    });

    const current = newParams.getAll(key);

    if (current.includes(value)) {
      newParams.delete(key);
      current.filter((v) => v !== value).forEach((v) => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }

    newParams.set("page", "1");
    return `/shop?${newParams.toString()}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">

      {/* HEADER */}
      <div className="bg-white border-b py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>
            <h1 className="text-4xl font-bold">Premium Shop</h1>
            <p className="text-gray-500 mt-1">
              Found {totalProducts} products
            </p>
          </div>

          <form action="/shop" className="w-full lg:w-[400px]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="w-full p-3 border rounded-xl bg-white"
            />
          </form>

        </div>
      </div>

      {/* MAIN 2 COLUMN */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

        {/* FILTER SIDEBAR */}
        <aside className="w-64 bg-white p-5 border rounded-xl h-fit sticky top-20 space-y-6">

          {/* CATEGORY */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase text-gray-500">
                Categories
              </h3>
              <Link href="/shop" className="text-xs text-red-500 font-bold">
                Reset
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  href={getToggleUrl("category", cat)}
                  className={`text-xs px-2 py-1 border rounded transition ${
                    selectedCategories.includes(cat) ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* BRAND */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase text-gray-500">
                Brands
              </h3>
              <Link href="/shop" className="text-xs text-red-500 font-bold">
                Reset
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {brands.map((brand, i) => (
                <Link
                  key={i}
                  href={getToggleUrl("brand", brand)}
                  className={`text-xs px-2 py-1 border rounded transition ${
                    selectedBrands.includes(brand) ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <form action="/shop" className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-gray-500">
              Price Range
            </h3>

            <input
              name="minPrice"
              defaultValue={minPrice}
              placeholder="Min price"
              className="w-full p-2 border rounded"
            />

            <input
              name="maxPrice"
              defaultValue={maxPrice}
              placeholder="Max price"
              className="w-full p-2 border rounded"
            />

            <button className="w-full bg-black text-white py-2 rounded font-bold">
              Apply
            </button>
          </form>

        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">

          {/* SORT */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-gray-400">
              Sort
            </span>
            <SortSelect currentSort={sort} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
                <Link href={`/product/${p.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={p.images?.[0] || "https://placehold.co/400x500"}
                    alt={p.name}
                    className="object-contain w-full h-full transition duration-500 group-hover:scale-110 p-4"
                  />
                  {p.discountPrice > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      Sale
                    </span>
                  )}
                </Link>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
                    <span>{p.brand}</span>
                    <span>{p.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition h-5">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-black text-gray-900">
                      ৳{p.discountPrice > 0 ? p.discountPrice : p.price}
                    </span>
                    {p.discountPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{p.price}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/product/${p.slug}`}
                    className="mt-4 block text-center bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg shadow-gray-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
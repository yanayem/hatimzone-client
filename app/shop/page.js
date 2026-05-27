export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import SortSelect from "@/components/SortSelect";
import ShopSearch from "@/components/shop/ShopSearch";
import FilterDrawer from "@/components/shop/FilterDrawer";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;

  const selectedCategories = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
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

  const limit = 6;
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

  let products = [];
  let totalProducts = 0;
  let categories = [];
  let brands = [];

  try {
    await connectDB();
    const results = await Promise.all([
      Product.find(filter)
        .select("name price discountPrice cover slug brand")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);
    products = results[0];
    totalProducts = results[1];
    categories = results[2];
    brands = results[3];
  } catch (error) {
    console.error("Error fetching shop data:", error);
  }


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
    <div className="bg-gray-100 min-h-screen text-gray-900 pb-20">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-8 md:py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Shop Collection</h1>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
                Found <span className="text-black font-bold">{totalProducts}</span> products
              </p>
            </div>

            <ShopSearch initialQuery={q} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">

        <FilterDrawer>
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-10 md:space-y-12">
            {/* PRICE RANGE */}
            <div>
              <h3 className="text-[12px] font-black uppercase text-gray-600 tracking-widest mb-6">
                Price Range
              </h3>
              <form action="/shop" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="minPrice"
                    defaultValue={minPrice}
                    placeholder="Min"
                    className="w-full bg-gray-50 border border-transparent focus:border-black rounded-xl px-4 py-3 text-sm font-bold outline-none transition"
                  />
                  <input
                    name="maxPrice"
                    defaultValue={maxPrice}
                    placeholder="Max"
                    className="w-full bg-gray-50 border border-transparent focus:border-black rounded-xl px-4 py-3 text-sm font-bold outline-none transition"
                  />
                </div>
                <button className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[12px] hover:bg-black transition shadow-lg shadow-gray-100">
                  Update List
                </button>
              </form>
            </div>
          </div>
        </FilterDrawer>

        {/* PRODUCTS GRID */}
        <main className="flex-1">

          <div className="mb-6 md:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-black uppercase text-gray-600 tracking-widest">
                Sort By
              </span>
              <SortSelect currentSort={sort} />
            </div>
            <p className="text-[12px] font-black text-gray-600 uppercase tracking-widest">
              {products.length} Items · Page {page}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {products.map((p) => (
              <div key={p._id} className="store-card group flex flex-col">
                <Link href={`/product/${p.slug || p._id}`} className="block relative aspect-[4/5] bg-gray-50 overflow-hidden m-2 rounded-2xl">
                  <img
                    src={p.cover || "https://placehold.co/400x500/6B7280/FFFFFF?text=No+Image"}
                    alt={p.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  {p.discountPrice > 0 && (
                    <span className="absolute top-4 left-4 bg-black text-white text-[12px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                      Sale
                    </span>
                  )}
                </Link>

                <div className="p-4 md:p-6 flex flex-col flex-1 pt-2">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <span className="text-[12px] font-black text-gray-600 uppercase tracking-widest">{p.brand}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-black transition text-sm md:text-lg h-5 md:h-7">
                    {p.name}
                  </h3>

                  <div className="mt-3 md:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 border-t border-gray-50 gap-3">
                    <span className="text-base md:text-xl font-black text-gray-900">
                      TK{p.discountPrice > 0 ? p.discountPrice : p.price}
                    </span>
                    <Link
                      href={`/product/${p.slug || p._id}`}
                      className="text-[12px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-full sm:w-auto text-center"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-16 flex justify-center items-center gap-3">
            {/* Prev Button */}
            {page > 1 ? (
              <Link
                href={`/shop?${new URLSearchParams({ ...params, page: page - 1 }).toString()}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
              >
                Prev
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm text-gray-300 cursor-not-allowed">
                Prev
              </span>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(Math.max(1, Math.ceil(totalProducts / limit)))].map((_, i) => (
                <Link
                  key={i}
                  href={`/shop?${new URLSearchParams({ ...params, page: i + 1 }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition ${page === i + 1 ? 'bg-black text-white shadow-lg shadow-gray-200' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>

            {/* Next Button */}
            {page < Math.ceil(totalProducts / limit) ? (
              <Link
                href={`/shop?${new URLSearchParams({ ...params, page: page + 1 }).toString()}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
              >
                Next
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm text-gray-300 cursor-not-allowed">
                Next
              </span>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

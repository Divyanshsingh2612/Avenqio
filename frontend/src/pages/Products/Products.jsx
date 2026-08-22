import { useMemo, useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import ProductCard from "../../components/product/ProductCard";
import { products } from "../../data/products";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesPrice = product.price <= maxPrice;

      const matchesRating = product.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating
      );
    });

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, category, maxPrice, minRating, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(150000);
    setMinRating(0);
    setSort("default");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            All Products
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Find the perfect products for you.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="relative max-w-2xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">

          <div className="flex items-center gap-3 mb-6">
            <FiSliders className="text-blue-600" size={22} />

            <h2 className="text-xl font-bold text-slate-900">
              Filters
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Price
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Number(e.target.value))
                  }
                  className="w-full accent-blue-600"
                />

                <span className="font-semibold text-blue-600 whitespace-nowrap">
                  ₹{maxPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Rating
              </label>

              <select
                value={minRating}
                onChange={(e) =>
                  setMinRating(Number(e.target.value))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>⭐ 4.0+</option>
                <option value={4.5}>⭐ 4.5+</option>
                <option value={4.8}>⭐ 4.8+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Recommended</option>
                <option value="price-low">
                  Price: Low → High
                </option>
                <option value="price-high">
                  Price: High → Low
                </option>
                <option value="rating">
                  Highest Rated
                </option>
                <option value="name">
                  Name: A → Z
                </option>
              </select>
            </div>

          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="mt-6 flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold"
          >
            <FiX />
            Clear Filters
          </button>

        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

import ProductCard from "../../components/product/ProductCard";
import api from "../../services/api.js";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Read search and category directly from the URL.
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");

  // Synchronize search and category with URL navigation.
  useEffect(() => {
    setSearch(urlSearch);
    setCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  // Fetch products from the backend.
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/products");
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("The products API did not return an array.");
        }

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);

        if (isMounted) {
          setError(
            "Unable to load products. Please check your internet connection and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate category options from actual API product categories.
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ],
    [products]
  );

  // Apply search, category, price, rating and sorting.
  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const name = String(product.name ?? product.title ?? "");
      const productCategory = String(product.category ?? "");
      const description = String(product.description ?? "");
      const brand = String(product.brand ?? "");

      const searchableText = [
        name,
        productCategory,
        description,
        brand,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm === "" || searchableText.includes(searchTerm);

      // Compare categories without case sensitivity.
      const matchesCategory =
        category === "All" ||
        productCategory.toLowerCase() === category.toLowerCase();

      const price = Number(product.price ?? 0);
      const rating = Number(product.rating ?? 0);

      const matchesPrice =
        Number.isFinite(price) && price <= maxPrice;

      const matchesRating = rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating
      );
    });

    if (sort === "price-low") {
      result.sort(
        (a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) => Number(b.price ?? 0) - Number(a.price ?? 0)
      );
    } else if (sort === "rating") {
      result.sort(
        (a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0)
      );
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name ?? a.title ?? "").localeCompare(
          String(b.name ?? b.title ?? "")
        )
      );
    }

    return result;
  }, [products, search, category, maxPrice, minRating, sort]);

  // Keep search and category in the URL.
  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = search.trim();
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  }

  // Update the category selection and URL together.
  function handleCategoryChange(event) {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);

    const params = new URLSearchParams(searchParams);

    if (selectedCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    setSearchParams(params);
  }

  // Clear all filters.
  function clearFilters() {
    setSearch("");
    setCategory("All");
    setMaxPrice(150000);
    setMinRating(0);
    setSort("default");
    setSearchParams({});
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 dark:bg-[#111113]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
            {category === "All" ? "All Products" : category}
          </h1>

          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Find the perfect products for you.
          </p>
        </div>

        {/* Product search */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1c1c1e]">
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl"
          >
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="search"
              name="search"
              placeholder="Search products, brands or categories..."
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl bg-slate-100 py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#29292c] dark:text-white"
            />
          </form>
        </div>

        {/* Filters */}
        <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1c1c1e]">
          <div className="mb-6 flex items-center gap-3">
            <FiSliders className="text-blue-600" size={22} />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Filters
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Category
              </label>

              <select
                id="product-category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-[#29292c] dark:text-white"
              >
                {category !== "All" &&
                  !categories.some(
                    (item) =>
                      item.toLowerCase() === category.toLowerCase()
                  ) && (
                    <option value={category}>{category}</option>
                  )}

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum price */}
            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Maximum Price
              </label>

              <div className="flex items-center gap-3">
                <input
                  id="max-price"
                  type="range"
                  min="0"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value))
                  }
                  className="w-full accent-blue-600"
                />

                <span className="whitespace-nowrap font-semibold text-blue-600">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Minimum rating */}
            <div>
              <label
                htmlFor="min-rating"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Minimum Rating
              </label>

              <select
                id="min-rating"
                value={minRating}
                onChange={(event) =>
                  setMinRating(Number(event.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-[#29292c] dark:text-white"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>⭐ 4.0+</option>
                <option value={4.5}>⭐ 4.5+</option>
                <option value={4.8}>⭐ 4.8+</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label
                htmlFor="product-sort"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Sort By
              </label>

              <select
                id="product-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-[#29292c] dark:text-white"
              >
                <option value="default">Recommended</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 flex items-center gap-2 font-semibold text-red-500 hover:text-red-600"
          >
            <FiX />
            Clear Filters
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-[#1c1c1e]">
            <p className="font-semibold text-slate-700 dark:text-gray-200">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center dark:border-red-900 dark:bg-[#1c1c1e]">
            <h2 className="text-xl font-bold text-red-600">
              Could not load products
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {filteredProducts.length}
                </span>{" "}
                products
                {search.trim() && (
                  <span> for &quot;{search.trim()}&quot;</span>
                )}
              </p>
            </div>

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
              <div className="rounded-3xl bg-white p-16 text-center shadow-sm dark:bg-[#1c1c1e]">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  No products found
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try another category, search, or filter.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

import { useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { products } from "../../data/products";

export default function Products() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">

      <h1 className="text-4xl font-bold mb-8">
        All Products
      </h1>

      {/* Search */}

      <div className="mb-10">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
}
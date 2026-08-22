import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
       <img
       src={product.image}
       alt={product.name}
       className="w-full h-64 object-contain p-4"
       />
       </Link>

        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300">
          <FiHeart size={18} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-6">
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
        <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition">
        {product.name}
        </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center text-yellow-500">
            <FiStar fill="currentColor" size={18} />
          </div>

          <span className="text-gray-600 font-medium">
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-600">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-300">
            <FiShoppingCart size={18} />
            Add to Cart
          </button>

          <button className="w-12 h-12 rounded-xl border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition duration-300 flex items-center justify-center">
            <FiHeart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
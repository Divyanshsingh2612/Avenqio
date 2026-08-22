import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import { products } from "../../data/products";

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-900">
          Product Not Found
        </h1>

        <Link
          to="/products"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-[1300px] mx-auto px-6">

        {/* Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        {/* Product */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="bg-gray-50 min-h-[500px] flex items-center justify-center p-10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-[550px] h-[500px] object-contain"
              />
            </div>

            {/* Details */}
            <div className="p-8 lg:p-12">

              {/* Category */}
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-4xl font-black text-slate-900 mt-5">
                {product.name}
              </h1>

              {/* Brand */}
              <p className="text-gray-500 mt-2">
                Brand:{" "}
                <span className="font-semibold text-gray-700">
                  {product.brand}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-5">
                <span className="text-yellow-500 text-xl">
                  ★
                </span>

                <span className="font-bold">
                  {product.rating}
                </span>

                <span className="text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-7">

                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <span className="inline-block mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-lg font-bold">
                  {product.discount}% OFF
                </span>

              </div>

              {/* Description */}
              <p className="text-gray-600 leading-7 mt-7">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    ✓ In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-red-500 font-semibold">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mt-7">

                <p className="font-semibold text-gray-700 mb-3">
                  Quantity
                </p>

                <div className="flex items-center border border-gray-200 rounded-xl w-fit">

                  <button
                    onClick={decreaseQuantity}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>

                  <span className="px-5 font-bold">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>

                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">

                <button
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition"
                >
                  <FiShoppingCart size={21} />
                  Add to Cart
                </button>

                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`px-5 rounded-xl border transition ${
                    wishlist
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FiHeart
                    size={23}
                    fill={wishlist ? "currentColor" : "none"}
                  />
                </button>

              </div>

            </div>
          </div>

          {/* Extra Information */}
          <div className="border-t border-gray-100 p-8 lg:p-12">

            <h2 className="text-2xl font-bold text-slate-900 mb-5">
              Product Information
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">
                  Brand
                </p>
                <p className="font-bold mt-1">
                  {product.brand}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">
                  Category
                </p>
                <p className="font-bold mt-1">
                  {product.category}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">
                  Rating
                </p>
                <p className="font-bold mt-1">
                  ⭐ {product.rating}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-gray-500 text-sm">
                  Reviews
                </p>
                <p className="font-bold mt-1">
                  {product.reviews}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
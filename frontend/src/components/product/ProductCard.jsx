
import { useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleWishlist = () => {
    if (!product?.id) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.id) {
      console.error("Cannot add product: product ID is missing.", product);
      return;
    }

    if (typeof product.stock === "number" && product.stock <= 0) {
      return;
    }

    dispatch(addToCart(product));
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const heartButton = (className) => (
    <button
      type="button"
      onClick={handleWishlist}
      aria-label={
        isWishlisted
          ? `Remove ${product.name} from wishlist`
          : `Add ${product.name} to wishlist`
      }
      aria-pressed={isWishlisted}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`${className} ${
        isWishlisted
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500"
      }`}
    >
      <FiHeart
        size={20}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-contain p-4"
          />
        </Link>

        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {product.category}
        </span>

        {heartButton(
          "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:bg-red-50"
        )}
      </div>

      <div className="p-6">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-xl font-bold text-slate-900 transition hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center text-yellow-500">
            <FiStar fill="currentColor" size={18} />
          </div>
          <span className="font-medium text-gray-600">
            {product.rating}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-blue-600">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              typeof product.stock === "number" && product.stock <= 0
            }
            className={`flex-1 rounded-xl py-3 font-semibold text-white transition duration-300 ${
              typeof product.stock === "number" && product.stock <= 0
                ? "cursor-not-allowed bg-gray-400"
                : added
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center gap-2`}
          >
            {typeof product.stock === "number" && product.stock <= 0 ? (
              "Out of Stock"
            ) : added ? (
              <>
                <FiCheck size={18} />
                Added!
              </>
            ) : (
              <>
                <FiShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>

          {heartButton(
            "flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300 transition duration-300 hover:border-red-500"
          )}
        </div>
      </div>
    </div>
  );
}

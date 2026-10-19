
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import {
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { addToCart } from "../../features/cart/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();

  const items = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <FaHeart className="text-red-500" />
            My Wishlist
          </h1>
          <p className="mt-2 text-gray-500">
            Your favorite products, all in one place.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <FaHeart className="mx-auto mb-4 text-5xl text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-gray-500">
              Save products you love and find them here later.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              >
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name || product.title || "Product"}
                    className="h-56 w-full object-contain p-5"
                  />
                </Link>

                <div className="p-5">
                  <h2 className="line-clamp-2 font-semibold text-gray-900">
                    {product.name || product.title}
                  </h2>

                  <p className="mt-2 text-xl font-bold text-blue-600">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        dispatch(removeFromWishlist(product.id))
                      }
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                      className="rounded-xl border border-gray-200 px-4 text-red-500 hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

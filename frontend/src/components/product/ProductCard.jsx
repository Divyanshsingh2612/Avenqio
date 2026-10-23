
import { useEffect, useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiCheck,
  FiArrowUpRight,
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
    (item) => item.id === product?.id
  );

  const isOutOfStock =
    typeof product?.stock === "number" && product.stock <= 0;

  useEffect(() => {
    if (!added) return;

    const timeoutId = setTimeout(() => {
      setAdded(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [added]);

  const handleWishlist = () => {
    if (!product?.id) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    if (!product?.id || isOutOfStock) return;

    dispatch(addToCart(product));
    setAdded(true);
  };

  const heartButton = (extraClasses = "") => (
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
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        isWishlisted
          ? "text-red-500"
          : "text-[#6e6e73] hover:text-red-500 dark:text-[#a1a1a6]"
      } ${extraClasses}`}
    >
      <FiHeart
        size={19}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );

  const price = Number(product?.price ?? 0);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] dark:border-white/[0.08] dark:bg-[#1c1c1e] dark:hover:border-white/15 dark:hover:shadow-black/20">
      {/* Product image */}
      <div className="relative m-2 overflow-hidden rounded-[19px] bg-[#f5f5f7] dark:bg-[#242426]">
        <Link
          to={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block"
        >
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden p-5 sm:p-6">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </Link>

        {product.category && (
          <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full border border-black/[0.05] bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#424245] backdrop-blur-md dark:border-white/10 dark:bg-[#1c1c1e]/85 dark:text-[#d1d1d6]">
            {product.category}
          </span>
        )}

        {heartButton(
          "absolute right-3 top-3 h-10 w-10 border border-black/[0.05] bg-white/90 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-[#1c1c1e]/90 dark:hover:bg-[#303033]"
        )}

        {isOutOfStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${product.id}`}
            className="min-w-0 flex-1"
          >
            <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-[-0.025em] text-[#1d1d1f] transition-colors hover:text-blue-600 dark:text-[#f5f5f7] dark:hover:text-blue-400 sm:text-lg">
              {product.name}
            </h3>
          </Link>

          <Link
            to={`/products/${product.id}`}
            aria-label={`View details for ${product.name}`}
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#86868b] transition-all hover:bg-[#f5f5f7] hover:text-[#1d1d1f] dark:hover:bg-[#303033] dark:hover:text-white"
          >
            <FiArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-3 flex min-h-5 items-center gap-1.5">
          <FiStar
            size={15}
            className="shrink-0 text-amber-500"
            fill="currentColor"
          />

          <span className="text-sm font-medium text-[#424245] dark:text-[#e5e5ea]">
            {product.rating ?? "New"}
          </span>

          {product.rating != null && (
            <span className="text-xs text-[#86868b]">
              · Customer rating
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-2xl">
            ₹{price.toLocaleString("en-IN")}
          </p>

          {typeof product.stock === "number" && !isOutOfStock && (
            <span className="text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6]">
              In stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
              isOutOfStock
                ? "cursor-not-allowed bg-[#e5e5e7] text-[#86868b] dark:bg-[#303033] dark:text-[#86868b]"
                : added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1d1d1f] text-white hover:bg-black active:scale-[0.98] dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-gray-200"
            }`}
          >
            {isOutOfStock ? (
              "Unavailable"
            ) : added ? (
              <>
                <FiCheck size={17} />
                Added
              </>
            ) : (
              <>
                <FiShoppingCart size={16} />
                Add to cart
              </>
            )}
          </button>

          {heartButton(
            "h-11 w-11 shrink-0 border border-black/10 bg-white hover:border-red-200 hover:bg-red-50 dark:border-white/10 dark:bg-transparent dark:hover:border-red-500/40 dark:hover:bg-red-500/10"
          )}
        </div>
      </div>
    </article>
  );
}

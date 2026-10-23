
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiCheck,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";

import { addToCart } from "../../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";

import api from "../../services/api.js";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);
      setAdded(false);

      try {
        const response = await api.get("/api/products");
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response.");
        }

        const found = data.find(
          (item) => String(item.id) === String(id)
        );

        if (active) {
          setProduct(found ?? null);

          if (!found) {
            setError("We couldn't find this product.");
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);

        if (active) {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(product?.id)
  );

  const cartItem = cartItems.find(
    (item) => String(item.id) === String(product?.id)
  );

  const price = Number(product?.price ?? 0);
  const stock = Math.max(0, Number(product?.stock ?? 0));
  const rating = Number(product?.rating ?? 0);
  const reviews = Number(
    product?.reviews ?? product?.review_count ?? 0
  );

  const originalPrice = Number(
    product?.originalPrice ??
      product?.original_price ??
      price
  );

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const formatPrice = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  function handleAddToCart() {
    if (!product || stock < 1) return;

    // Your current reducer adds one unit per dispatch.
    for (let i = 0; i < quantity; i += 1) {
      dispatch(addToCart(product));
    }

    setAdded(true);
  }

  function handleWishlist() {
    if (!product) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f5f5f7] px-5 py-20 dark:bg-[#111113]">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-36 rounded bg-gray-200 dark:bg-white/10" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="min-h-[400px] rounded-[32px] bg-gray-200 dark:bg-white/10" />
            <div className="space-y-5 py-8">
              <div className="h-5 w-24 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-12 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-8 w-40 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-24 rounded bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f5f5f7] px-5 text-center dark:bg-[#111113]">
        <h1 className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
          Product unavailable
        </h1>

        <p className="mt-3 max-w-md text-gray-500 dark:text-gray-400">
          {error || "This product could not be found."}
        </p>

        <Link
          to="/products"
          className="mt-7 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] py-8 text-[#1d1d1f] transition-colors duration-300 dark:bg-[#111113] dark:text-[#f5f5f7] sm:py-12">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Link
          to="/products"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <FiArrowLeft size={17} />
          All products
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-black/[0.04] bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#1c1c1e] lg:rounded-[36px]">
          <div className="grid lg:grid-cols-2">
            {/* Product image */}
            <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f8fa] to-[#eeeeF2] p-8 dark:from-[#242426] dark:to-[#19191b] sm:min-h-[500px] sm:p-12 lg:min-h-[620px]">
              <span className="absolute left-6 top-6 rounded-full border border-black/[0.05] bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-600 backdrop-blur dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
                {product.category || "Featured product"}
              </span>

              {discount > 0 && (
                <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              )}

              <img
                src={product.image}
                alt={product.name || product.title || "Product"}
                className="relative z-10 max-h-[420px] w-full max-w-[520px] object-contain drop-shadow-xl transition duration-500 hover:scale-[1.04] sm:max-h-[480px]"
              />

              <div className="pointer-events-none absolute bottom-8 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-full bg-black/10 blur-2xl dark:bg-black/30" />
            </div>

            {/* Product details */}
            <div className="flex flex-col p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                {product.brand || "AVENQIO SELECT"}
              </p>

              <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {product.name || product.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  <span aria-hidden="true">★</span>
                  {rating ? rating.toFixed(1) : "New"}
                </span>

                <span className="text-gray-500 dark:text-gray-400">
                  {reviews} {reviews === 1 ? "review" : "reviews"}
                </span>

                <span className="text-gray-300 dark:text-gray-600">•</span>

                <span
                  className={
                    stock > 0
                      ? "font-medium text-emerald-600 dark:text-emerald-400"
                      : "font-medium text-red-500"
                  }
                >
                  {stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {formatPrice(price)}
                </span>

                {discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  You save {formatPrice(originalPrice - price)}
                </p>
              )}

              <div className="my-8 h-px bg-gray-100 dark:bg-white/10" />

              <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
                {product.description ||
                  "Thoughtfully selected technology designed to make everyday life better."}
              </p>

              {/* Quantity selector */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold">Quantity</p>

                <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-[#242426]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
                  >
                    <FiMinus size={15} />
                  </button>

                  <span className="min-w-10 text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock}
                    onClick={() =>
                      setQuantity((q) => Math.min(stock, q + 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
                  >
                    <FiPlus size={15} />
                  </button>
                </div>

                {stock > 0 && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {stock} available
                  </p>
                )}
              </div>

              {/* Cart and wishlist */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stock < 1}
                  className="flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {added ? (
                    <FiCheck size={19} />
                  ) : (
                    <FiShoppingCart size={19} />
                  )}

                  {stock < 1
                    ? "Out of stock"
                    : added
                      ? `Added ${quantity} to cart`
                      : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleWishlist}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={`flex min-h-14 items-center justify-center gap-2 rounded-full border px-6 py-4 text-sm font-semibold transition ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400"
                      : "border-gray-200 bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:hover:bg-white/5"
                  }`}
                >
                  <FiHeart
                    size={19}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                  <span className="sm:hidden">
                    {isWishlisted ? "Saved" : "Wishlist"}
                  </span>
                </button>
              </div>

              {cartItem && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Already in your cart: {cartItem.quantity}
                </p>
              )}

              {/* Trust information */}
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 dark:border-white/10 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <FiTruck
                    className="mt-0.5 text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold">Reliable delivery</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      Delivery details at checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiShield
                    className="mt-0.5 text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      Shopping with confidence
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      Review your order before payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="border-t border-gray-100 px-6 py-9 dark:border-white/10 sm:px-10 sm:py-12 lg:px-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              The details
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Product information
            </h2>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Brand",
                  value: product.brand || "Not specified",
                },
                {
                  label: "Category",
                  value: product.category || "Not specified",
                },
                {
                  label: "Customer rating",
                  value: rating ? `${rating} / 5` : "Not rated yet",
                },
                {
                  label: "Availability",
                  value: stock > 0 ? `${stock} in stock` : "Out of stock",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 bg-[#f8f8fa] p-5 dark:border-white/[0.06] dark:bg-[#242426]"
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Continue shopping */}
        <div className="mt-10 flex flex-col justify-between gap-4 rounded-3xl bg-white p-7 dark:bg-[#1c1c1e] sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Still exploring?
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Discover more products selected for you.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Explore products
            <FiArrowLeft className="rotate-180" size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

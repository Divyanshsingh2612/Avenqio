
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiShield,
} from "react-icons/fi";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items ?? []);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const totalItems = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * (Number(item.quantity) || 0),
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiShoppingBag size={42} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FiArrowLeft />
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <FiArrowLeft />
          Continue Shopping
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-slate-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <section
            className="space-y-4 lg:col-span-2"
            aria-label="Cart items"
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-6"
              >
                <Link
                  to={`/products/${item.id}`}
                  className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-slate-50 sm:w-32"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full object-contain p-2"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {item.brand || item.category}
                  </p>

                  <Link to={`/products/${item.id}`}>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 hover:text-blue-600">
                      {item.name}
                    </h2>
                  </Link>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.quantity <= 1}
                        className="p-2 text-slate-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiMinus size={15} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        disabled={
                          typeof item.stock === "number" &&
                          item.quantity >= item.stock
                        }
                        className="p-2 text-slate-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiPlus size={15} />
                      </button>
                    </div>

                    {/* Remove item */}
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Item total</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatPrice(
                      Number(item.price || 0) * (Number(item.quantity) || 0)
                    )}
                  </p>
                </div>
              </article>
            ))}
          </section>

          {/* Order summary */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>

              {subtotal > 0 && subtotal < 999 && (
                <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                  Add {formatPrice(999 - subtotal)} more for free shipping.
                </p>
              )}

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigate to Checkout */}
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl bg-blue-600 py-3.5 text-center font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <FiShield size={15} />
              Secure checkout experience
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Free shipping on orders of ₹999 or more.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

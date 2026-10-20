
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";

export default function Orders() {
  const orders = useSelector(
    (state) => state.orders?.items ?? []
  );

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <FiArrowLeft />
          Continue Shopping
        </Link>

        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900">
            <FiPackage className="text-blue-600" />
            My Orders
          </h1>
          <p className="mt-2 text-slate-500">
            View your previously placed demo orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <FiShoppingBag
              size={52}
              className="mx-auto text-slate-300"
            />
            <h2 className="mt-5 text-xl font-bold text-slate-800">
              No orders yet
            </h2>
            <p className="mt-2 text-slate-500">
              Your placed demo orders will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <section
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Order reference
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-blue-600">
                      {order.id}
                    </h2>
                  </div>

                  <div>
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <FiClock />
                      {formatDate(order.createdAt)}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {order.status || "Demo Order"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${order.id}-${item.id}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="h-14 w-14 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {item.name || "Product"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-900">
                        {formatPrice(
                          Number(item.price || 0) *
                            (Number(item.quantity) || 0)
                        )}
                      </p>
                    </div>
                  ))}

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span>
                        {Number(order.shipping) === 0
                          ? "Free"
                          : formatPrice(order.shipping)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between border-t border-slate-100 pt-3">
                      <span className="font-bold text-slate-900">
                        Order Total
                      </span>
                      <span className="text-xl font-extrabold text-blue-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

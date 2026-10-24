
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
  FiPackage,
  FiClock,
  FiTruck,
  FiLock,
  FiShoppingBag,
  FiCheck,
} from "react-icons/fi";

import { clearCart } from "../../features/cart/cartSlice";
import { addOrder } from "../../features/orders/ordersSlice";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const fields = [
  {
    name: "fullName",
    label: "Full name",
    placeholder: "Enter your full name",
    autoComplete: "name",
    fullWidth: true,
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Mobile number",
    placeholder: "10-digit mobile number",
    type: "tel",
    autoComplete: "tel",
    maxLength: 10,
  },
  {
    name: "address",
    label: "Street address",
    placeholder: "House number, street, area",
    autoComplete: "street-address",
    fullWidth: true,
  },
  {
    name: "city",
    label: "City",
    placeholder: "Your city",
    autoComplete: "address-level2",
  },
  {
    name: "state",
    label: "State",
    placeholder: "Your state",
    autoComplete: "address-level1",
  },
  {
    name: "pincode",
    label: "PIN code",
    placeholder: "6-digit PIN code",
    autoComplete: "postal-code",
    maxLength: 6,
  },
];

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart?.items ?? []);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * (Number(item.quantity) || 0),
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, 999 - subtotal);
  const shippingProgress = Math.min(100, (subtotal / 999) * 100);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "phone" || name === "pincode"
          ? value.replace(/\D/g, "")
          : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!form.address.trim()) {
      newErrors.address = "Enter your street address.";
    }

    if (!form.city.trim()) {
      newErrors.city = "Enter your city.";
    }

    if (!form.state.trim()) {
      newErrors.state = "Enter your state.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (items.length === 0 || !validateForm()) return;

    const generatedOrderNumber = `AV-${Date.now().toString().slice(-8)}`;

    const order = {
      id: generatedOrderNumber,
      createdAt: new Date().toISOString(),
      customer: { ...form },
      items: items.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
      status: "Demo Order",
    };

    try {
      dispatch(addOrder(order));

      const savedOrders = JSON.parse(
        localStorage.getItem("avenqio-orders") || "[]"
      );

      const wasSaved = savedOrders.some(
        (savedOrder) => savedOrder.id === generatedOrderNumber
      );

      if (!wasSaved) {
        throw new Error("The order could not be saved.");
      }

      setOrderNumber(generatedOrderNumber);
      dispatch(clearCart());
      setOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Unable to save demo order:", error);
      window.alert("Your demo order could not be saved. Please try again.");
    }
  }

  const inputClass = (name) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-[#242426] dark:text-white dark:placeholder:text-gray-500 ${
      errors[name]
        ? "border-red-400 dark:border-red-400"
        : "border-gray-200 dark:border-white/10"
    }`;

  // Order confirmation
  if (orderPlaced) {
    return (
      <main className="min-h-[75vh] bg-[#f5f5f7] px-5 py-16 dark:bg-[#111113]">
        <section className="mx-auto max-w-xl rounded-[32px] border border-black/[0.04] bg-white p-8 text-center shadow-sm dark:border-white/[0.07] dark:bg-[#1c1c1e] sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
            <FiCheckCircle size={42} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            AVENQIO ORDER
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white sm:text-4xl">
            Your order is saved!
          </h1>

          <p className="mt-4 leading-7 text-gray-500 dark:text-gray-400">
            Your demo order has been saved in this browser. No payment was
            collected and no real order was sent to a server.
          </p>

          <div className="mt-7 rounded-2xl bg-[#f5f5f7] p-5 dark:bg-[#242426]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Demo order reference
            </p>
            <p className="mt-2 text-2xl font-bold tracking-wide text-blue-600 dark:text-blue-400">
              {orderNumber}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <FiCheck />
            Order saved locally
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              <FiPackage />
              View order history
            </Link>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-full border border-gray-200 px-6 py-4 font-semibold transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Continue shopping
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f5f7] px-5 py-16 dark:bg-[#111113]">
        <section className="w-full max-w-lg rounded-[32px] border border-black/[0.04] bg-white p-8 text-center shadow-sm dark:border-white/[0.07] dark:bg-[#1c1c1e] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            <FiShoppingBag size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
            Your cart is empty
          </h1>

          <p className="mt-3 leading-7 text-gray-500 dark:text-gray-400">
            Your next favourite find is waiting. Explore our collection to get
            started.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-[#1d1d1f] transition-colors duration-300 dark:bg-[#111113] dark:text-[#f5f5f7] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[1240px]">
        {/* Header */}
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <FiArrowLeft size={17} />
          Back to cart
        </Link>

        <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Almost yours
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Checkout.
            </h1>
            <p className="mt-3 max-w-lg text-base leading-7 text-gray-500 dark:text-gray-400">
              A few details, and your next favourite thing is on its way.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 dark:border-white/10 dark:bg-[#1c1c1e] dark:text-gray-300 sm:self-auto">
            <FiLock className="text-emerald-600 dark:text-emerald-400" />
            Demo checkout
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Your cart", number: "01", done: true },
            { label: "Delivery", number: "02", done: true },
            { label: "Review", number: "03", done: false },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-black/[0.04] bg-white p-3 dark:border-white/[0.07] dark:bg-[#1c1c1e] sm:p-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
                  }`}
                >
                  {step.done ? <FiCheck /> : step.number}
                </span>
                <span className="text-xs font-semibold sm:text-sm">
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_390px] lg:gap-8">
            {/* Shipping form */}
            <section className="rounded-[28px] border border-black/[0.04] bg-white p-6 shadow-sm dark:border-white/[0.07] dark:bg-[#1c1c1e] sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <FiTruck size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Delivery information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.fullWidth ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      maxLength={field.maxLength}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={
                        errors[field.name] ? `${field.name}-error` : undefined
                      }
                      className={inputClass(field.name)}
                    />

                    {errors[field.name] && (
                      <p
                        id={`${field.name}-error`}
                        className="mt-2 text-xs font-medium text-red-500"
                      >
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={inputClass("country")}
                  >
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f5f8ff] p-4 text-sm leading-6 text-blue-900 dark:bg-blue-400/10 dark:text-blue-200">
                <FiShield className="mt-0.5 shrink-0" size={19} />
                <p>
                  This is a demo checkout. Your order is saved in this
                  browser only. No payment is collected and your details are
                  not submitted to a server.
                </p>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-[28px] border border-black/[0.04] bg-white p-6 shadow-sm dark:border-white/[0.07] dark:bg-[#1c1c1e] sm:p-7 lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  Order summary
                </h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {items.reduce(
                    (sum, item) => sum + (Number(item.quantity) || 0),
                    0
                  )}{" "}
                  items
                </span>
              </div>

              <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl bg-[#f5f5f7] p-2 dark:bg-[#242426]">
                      <img
                        src={item.image}
                        alt={item.name || item.title || "Product"}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1 py-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item.name || item.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {formatPrice(
                          Number(item.price || 0) *
                            (Number(item.quantity) || 0)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping progress */}
              {subtotal > 0 && subtotal < 999 && (
                <div className="mt-6 rounded-2xl bg-[#f5f8ff] p-4 dark:bg-blue-400/10">
                  <p className="text-xs font-medium leading-5 text-blue-800 dark:text-blue-200">
                    Add{" "}
                    <strong>{formatPrice(remainingForFreeShipping)}</strong>{" "}
                    more for free shipping.
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5 text-sm dark:border-white/10">
                <div className="flex justify-between gap-3 text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1d1d1f] dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#1d1d1f] dark:text-white">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Place demo order
                <FiArrowLeft className="rotate-180" size={17} />
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                <FiClock size={14} />
                Demo only — no payment will be collected.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                <FiShield className="text-emerald-600 dark:text-emerald-400" />
                Secure-looking demo checkout
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

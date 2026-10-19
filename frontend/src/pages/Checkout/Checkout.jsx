
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";
import { clearCart } from "../../features/cart/cartSlice";

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

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart?.items ?? []);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * (Number(item.quantity) || 0),
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Demo only: this does not create a backend order or take payment.
    const generatedOrderNumber = `AV-${Date.now().toString().slice(-8)}`;

    setOrderNumber(generatedOrderNumber);
    dispatch(clearCart());
    setOrderPlaced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <FiCheckCircle className="mx-auto text-green-500" size={64} />

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
            Demo order successful!
          </h1>

          <p className="mt-3 text-slate-600">
            Your checkout form was submitted successfully. No payment was
            collected and no real order was sent to a server.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Demo order reference</p>
            <p className="mt-1 text-xl font-bold text-blue-600">
              {orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <FiPackage className="mx-auto text-blue-600" size={52} />

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Add products to your cart before checking out.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </section>
      </main>
    );
  }

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "phone",
      label: "Mobile Number",
      placeholder: "10-digit mobile number",
      type: "tel",
      autoComplete: "tel",
      maxLength: 10,
    },
    {
      name: "address",
      label: "Street Address",
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
      label: "PIN Code",
      placeholder: "6-digit PIN code",
      autoComplete: "postal-code",
      maxLength: 6,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Cart
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-slate-500">
            Enter your delivery details and review your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* Shipping address form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900">
                Shipping Information
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fields marked with * are required.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.fullWidth ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {field.label} *
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
                        errors[field.name]
                          ? `${field.name}-error`
                          : undefined
                      }
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-100 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-slate-200 focus:border-blue-500"
                      }`}
                    />

                    {errors[field.name] && (
                      <p
                        id={`${field.name}-error`}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Country *
                  </label>

                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <FiShield className="mt-0.5 shrink-0" size={19} />
                <p>
                  This demo collects shipping details only in the current
                  page session. It does not send them to a server.
                </p>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {formatPrice(
                        Number(item.price || 0) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
                <div className="flex justify-between gap-3 text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-slate-200 pt-4">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {subtotal > 0 && subtotal < 999 && (
                <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                  Add {formatPrice(999 - subtotal)} more to qualify for free
                  shipping.
                </p>
              )}

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Place Demo Order
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Demo only — no payment will be collected.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

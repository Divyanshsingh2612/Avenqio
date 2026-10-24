
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import api from "../../services/api";
import { setCredentials } from "../../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/profile" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.full_name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      dispatch(setCredentials(response.data));
      navigate("/profile", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((item) => item.msg).join(" ")
            : err.code === "ERR_NETWORK"
              ? "Cannot connect to the server. Please try again."
              : "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-violet-500/20";

  const fields = [
    {
      name: "full_name",
      label: "Full name",
      placeholder: "Your full name",
      icon: FiUser,
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email address",
      placeholder: "you@example.com",
      icon: FiMail,
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "At least 8 characters",
      icon: FiLock,
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      placeholder: "Enter your password again",
      icon: FiLock,
      type: "password",
      autoComplete: "new-password",
    },
  ];

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 dark:bg-[#09090b] dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/40 dark:border-white/10 dark:bg-[#111113] dark:shadow-black/20 sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
            <FiShoppingBag size={26} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Create account<span className="text-violet-600">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join Avenqio and start shopping.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, placeholder, icon: Icon, type, autoComplete }) => (
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm font-medium">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id={name}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  required
                  minLength={name.includes("password") ? 8 : undefined}
                  maxLength={name.includes("password") ? 128 : undefined}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

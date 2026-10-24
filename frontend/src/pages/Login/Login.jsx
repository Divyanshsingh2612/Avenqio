
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMail, FiLock, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import api from "../../services/api";
import { setCredentials } from "../../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({ email: "", password: "" });
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
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      dispatch(setCredentials(response.data));

      const destination = location.state?.from;
      navigate(
        destination
          ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
          : "/profile",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          (err.code === "ERR_NETWORK"
            ? "Cannot connect to the server. Please try again."
            : "Login failed. Please check your details.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 dark:bg-[#09090b] dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/40 dark:border-white/10 dark:bg-[#111113] dark:shadow-black/20 sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
            <FiShoppingBag size={26} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Welcome back<span className="text-violet-600">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue shopping with Avenqio.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {typeof error === "string" ? error : "Unable to sign in. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-violet-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}

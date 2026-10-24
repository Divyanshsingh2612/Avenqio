
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiHeart,
  FiEdit2,
  FiSave,
  FiX,
  FiArrowRight,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

import api from "../../services/api";
import {
  updateUser,
  logout,
} from "../../features/auth/authSlice";

const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

function readSavedProfile() {
  try {
    const saved = localStorage.getItem("avenqio-profile");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orders = useSelector(
    (state) => state.orders?.items || []
  );

  const wishlist = useSelector(
    (state) => state.wishlist?.items || []
  );

  const authUser = useSelector(
    (state) => state.auth?.user
  );

  const token = useSelector(
    (state) => state.auth?.token
  );

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(Boolean(token));
  const [loadError, setLoadError] = useState("");

  const [profile, setProfile] = useState(() => {
    const localProfile = readSavedProfile();

    return {
      ...EMPTY_PROFILE,
      ...localProfile,
      fullName:
        authUser?.full_name || localProfile.fullName || "",
      email:
        authUser?.email || localProfile.email || "",
    };
  });

  // Fetch the logged-in user's account details.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setLoadError("");
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response = await api.get("/api/auth/me");

        if (cancelled) return;

        const user = response.data;

        dispatch(updateUser(user));

        setProfile((previous) => ({
          ...previous,
          fullName: user.full_name || "",
          email: user.email || "",
        }));
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to load authenticated profile:",
          error
        );

        setLoadError(
          error.response?.status === 401
            ? "Your session has expired. Please log in again."
            : "We couldn't load your account details. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [token, dispatch]);

  // Log out the current user.
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();

    try {
      // Phone and address are currently saved locally.
      localStorage.setItem(
        "avenqio-profile",
        JSON.stringify(profile)
      );

      setEditing(false);
      setSaved(true);
    } catch {
      setSaved(false);
      alert(
        "Unable to save your profile. Please check browser storage."
      );
    }
  };

  const cancelEditing = () => {
    const localProfile = readSavedProfile();

    setProfile({
      ...EMPTY_PROFILE,
      ...localProfile,
      fullName:
        authUser?.full_name || localProfile.fullName || "",
      email:
        authUser?.email || localProfile.email || "",
    });

    setEditing(false);
    setSaved(false);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-violet-500/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300";

  const fields = [
    {
      name: "fullName",
      label: "Full name",
      icon: FiUser,
      placeholder: "Enter your name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email address",
      icon: FiMail,
      placeholder: "you@example.com",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Phone number",
      icon: FiPhone,
      placeholder: "Enter your phone number",
      type: "tel",
    },
    {
      name: "address",
      label: "Delivery address",
      icon: FiMapPin,
      placeholder: "Enter your address",
      type: "text",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-[#09090b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Your account
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
            <span className="text-violet-600">.</span>
          </h1>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal details and shopping activity.
          </p>
        </div>

        {/* Error message */}
        {loadError && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <span>{loadError}</span>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile sidebar */}
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111113]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-violet-500/20">
                {profile.fullName.trim() ? (
                  profile.fullName.trim().charAt(0).toUpperCase()
                ) : (
                  <FiUser size={34} />
                )}
              </div>

              <h2 className="mt-4 break-words text-xl font-bold">
                {loading
                  ? "Loading profile..."
                  : profile.fullName || "Welcome, Shopper!"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                {profile.email || "Your account email will appear here"}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <FiShield />
                Avenqio Member
              </div>
            </div>

            <div className="my-6 border-t border-gray-100 dark:border-white/10" />

            <Link
              to="/orders"
              className="flex items-center justify-between rounded-xl p-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <FiPackage className="text-violet-500" />
                My Orders
              </span>
              <FiArrowRight className="text-gray-400" />
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center justify-between rounded-xl p-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <FiHeart className="text-violet-500" />
                My Wishlist
              </span>

              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-white/10">
                {wishlist.length}
              </span>
            </Link>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </aside>

          {/* Personal information */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111113] sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Keep your contact details up to date.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setSaved(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              )}
            </div>

            {saved && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
              >
                Profile saved successfully!
              </div>
            )}

            <form onSubmit={saveProfile}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {fields.map(
                  ({
                    name,
                    label,
                    icon: Icon,
                    placeholder,
                    type,
                    required,
                  }) => (
                    <div key={name}>
                      <label className={labelClass} htmlFor={name}>
                        {label}
                      </label>

                      <div className="relative">
                        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          id={name}
                          name={name}
                          type={type}
                          value={profile[name] || ""}
                          onChange={updateField}
                          placeholder={placeholder}
                          readOnly={
                            !editing ||
                            (name === "fullName" &&
                              Boolean(authUser?.full_name)) ||
                            (name === "email" &&
                              Boolean(authUser?.email))
                          }
                          required={editing && required}
                          autoComplete={
                            name === "fullName"
                              ? "name"
                              : name === "email"
                              ? "email"
                              : name === "phone"
                              ? "tel"
                              : "street-address"
                          }
                          className={`${inputClass} ${
                            !editing ? "cursor-default opacity-80" : ""
                          }`}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              {editing && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    <FiSave />
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              )}
            </form>

            {/* Activity cards */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-5 dark:bg-white/[0.04]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <FiPackage size={21} />
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {orders.length}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Orders placed on this device
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5 dark:bg-white/[0.04]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
                  <FiHeart size={21} />
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {wishlist.length}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Saved wishlist items
                </p>
              </div>
            </div>

            {/* Shopping call to action */}
            <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-500/15 dark:bg-violet-500/[0.06]">
              <h3 className="font-semibold">
                Shopping with Avenqio
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Discover products, save your favourites, and manage your
                shopping activity from one place.
              </p>

              <Link
                to="/products"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:gap-3 dark:text-violet-300"
              >
                Explore Products <FiArrowRight />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const cartItems = useSelector(
    (state) => state.cart?.items ?? []
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const wishlistCount = wishlistItems.length;

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    navigate({
      pathname: "/products",
      search: query
        ? `?search=${encodeURIComponent(query)}`
        : "",
    });

    setSearchTerm("");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4 lg:flex-nowrap">
          <Link
            to="/"
            className="text-3xl font-black text-blue-600 sm:text-4xl"
          >
            AVENQIO
          </Link>

          <form
            role="search"
            onSubmit={handleSearch}
            className="order-3 w-full lg:order-none lg:mx-6 lg:w-[420px] lg:shrink-0"
          >
            <div className="flex items-center rounded-full bg-slate-100 px-5 py-3 transition focus-within:ring-2 focus-within:ring-blue-500">
              <FiSearch className="shrink-0 text-xl text-gray-500" />

              <input
                type="search"
                name="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="ml-3 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-gray-500"
              />

              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-sm text-gray-500 hover:text-red-500"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                aria-label="Submit product search"
                className="ml-2 rounded-full p-1 text-gray-600 transition hover:text-blue-600"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-6 lg:flex xl:gap-10">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>
              Wishlist
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              Cart
            </NavLink>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative inline-flex transition hover:scale-110"
            >
              <FiHeart
                size={26}
                className={
                  wishlistCount > 0
                    ? "text-red-500"
                    : "text-gray-700"
                }
              />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            </Link>

            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative inline-flex items-center justify-center transition hover:scale-110"
            >
              <FiShoppingCart size={26} className="text-gray-700" />
              <span className="absolute -right-2 -top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                alert("Login will be available soon!")
              }
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700 sm:px-5"
            >
              <FiUser />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


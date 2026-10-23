
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiSearch,
} from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Read the current cart from Redux
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  // Count all items, including repeated quantities
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  // Navigate to Products with the search term
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchTerm("");
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:flex-nowrap md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-blue-600"
          onClick={() => setMenuOpen(false)}
        >
          AVENQIO<span className="text-slate-900">.</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>
        </div>

        {/* Navbar search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="order-3 flex w-full items-center md:order-none md:w-auto md:flex-1 md:max-w-sm md:mx-4"
        >
          <div className="relative w-full">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              aria-label="Submit product search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Browse products"
            title="Browse products"
            onClick={() => navigate("/products")}
            className="hidden rounded-full p-2 text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            <FiSearch size={20} />
          </button>

          <button
            type="button"
            aria-label="Account"
            title="Account"
            onClick={() => alert("Account feature coming soon!")}
            className="hidden rounded-full p-2 text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            <FiUser size={20} />
          </button>

          {/* Cart icon and red count badge */}
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative inline-flex items-center justify-center overflow-visible p-2 text-slate-700"
          >
            <FiShoppingCart size={26} />

            <span
              aria-label={`${cartCount} items in cart`}
              className="absolute -right-1 -top-1 z-10 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-xs font-bold leading-none text-white"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </NavLink>

            <NavLink
              to="/cart"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Cart ({cartCount})
            </NavLink>

            {/* Mobile search */}
            <form onSubmit={handleSearch} role="search" className="pt-2">
              <div className="relative w-full">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products on mobile"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  aria-label="Submit mobile product search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}


import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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

  // Read the current cart from Redux
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  // Count all items, including repeated quantities
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-700 hover:text-blue-600"
    }`;

  // Temporary diagnostic: check the count in browser Console
  console.log("Avenqio Navbar cart count:", cartCount);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
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

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            aria-label="Browse products"
            className="hidden rounded-full p-2 text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            <FiSearch size={20} />
          </Link>

          <button
            type="button"
            aria-label="Account"
            title="Account"
            className="hidden rounded-full p-2 text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            <FiUser size={20} />
          </button>

          {/* Cart icon and red count badge */}
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              color: "#334155",
              textDecoration: "none",
              overflow: "visible",
            }}
          >
            <FiShoppingCart size={26} />

            <span
              aria-label={`${cartCount} items in cart`}
              style={{
                position: "absolute",
                top: "-3px",
                right: "-5px",
                zIndex: 100,
                minWidth: "22px",
                height: "22px",
                padding: "0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                borderRadius: "9999px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "2px solid #ffffff",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
                visibility: "visible",
                opacity: 1,
              }}
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
          </div>
        </div>
      )}
    </header>
  );
}

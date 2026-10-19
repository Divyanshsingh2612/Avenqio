
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function Navbar() {
  // Get cart items from the existing Redux store
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  // Count total units in the cart
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  // Wishlist count placeholder until wishlist state is connected
  const wishlistCount = 0;

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-black text-blue-600"
          >
            AVENQIO
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center w-[420px] bg-slate-100 rounded-full px-5 py-3">
            <FiSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none ml-3 w-full text-lg placeholder:text-gray-500"
            />
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-10">
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

          {/* Right-side icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative inline-flex hover:scale-110 transition"
            >
              <FiHeart size={26} />

              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart with live Redux count */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative inline-flex items-center justify-center hover:scale-110 transition"
            >
              <FiShoppingCart size={26} />

              <span
                className="absolute -top-2 -right-2 z-10 min-w-5 h-5 px-1 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{
                  backgroundColor: "#2563eb",
                  visibility: "visible",
                  opacity: 1,
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>

            {/* Login */}
            <button
              type="button"
              onClick={() => alert("Login will be available soon!")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition"
            >
              <FiUser />
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-blue-600"
          >
            ShopSmart AI
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center w-[400px] bg-gray-100 rounded-xl px-4 py-2">
            <FiSearch className="text-gray-500" />

            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none ml-3 w-full"
            />
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-8">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Cart
            </NavLink>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">

            <button className="relative">
              <FiHeart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button className="relative">
              <FiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <FiUser />
              Login
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}
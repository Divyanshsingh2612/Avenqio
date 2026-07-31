import { Link, NavLink } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}

          <Link
            to="/"
            className="text-4xl font-black text-blue-600"
          >
            ShopSmart AI
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

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Cart
            </NavLink>

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-6">

            <button className="relative hover:scale-110 transition">

              <FiHeart size={26} />

              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                0
              </span>

            </button>

            <button className="relative hover:scale-110 transition">

              <FiShoppingCart size={26} />

              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                0
              </span>

            </button>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition">

              <FiUser />

              Login

            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}
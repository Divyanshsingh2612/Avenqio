
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Orders", to: "/orders" },
  { label: "Wishlist", to: "/wishlist" },
];

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("avenqio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("avenqio-theme", theme);
    } catch {
      // Theme still works for the current page if storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const closeMenuOnResize = () => {
      if (window.innerWidth > 780) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnResize);

    return () => {
      window.removeEventListener("resize", closeMenuOnResize);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    navigate({
      pathname: "/products",
      search: query ? `?search=${encodeURIComponent(query)}` : "",
    });

    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `avenqio-nav-link${isActive ? " active" : ""}`;

  const themeToggle = (
    <button
      type="button"
      className="avenqio-icon-button"
      onClick={() =>
        setTheme((currentTheme) =>
          currentTheme === "dark" ? "light" : "dark"
        )
      }
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
    </button>
  );

  return (
    <header className="avenqio-navbar">
      <div className="avenqio-nav-inner">
        <Link
          to="/"
          className="avenqio-logo"
          aria-label="Avenqio home"
          onClick={handleNavigation}
        >
          avenqio<span>.</span>
        </Link>

        <nav className="avenqio-nav-links" aria-label="Main navigation">
          {navigationLinks
            .filter((item) => item.to !== "/wishlist")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="avenqio-nav-actions">
          <form
            role="search"
            onSubmit={handleSearch}
            className="avenqio-search"
          >
            <FiSearch size={17} aria-hidden="true" />

            <input
              type="search"
              name="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />

            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--text-secondary)",
                  padding: 0,
                }}
              >
                <FiX size={15} />
              </button>
            )}
          </form>

          {themeToggle}

          <Link
            to="/wishlist"
            className="avenqio-icon-button"
            aria-label={`Wishlist, ${wishlistCount} items`}
            title="Wishlist"
          >
            <FiHeart
              size={20}
              color={wishlistCount > 0 ? "#e5484d" : "currentColor"}
            />
            {wishlistCount > 0 && (
              <span className="avenqio-count">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="avenqio-icon-button"
            aria-label={`Shopping cart, ${cartCount} items`}
            title="Shopping cart"
          >
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="avenqio-count">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="avenqio-login-button"
            onClick={() => navigate("/login")}
          >
            <FiUser size={17} />
            Login
          </button>

          <button
            type="button"
            className="avenqio-icon-button avenqio-mobile-toggle"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="avenqio-mobile-menu" aria-label="Mobile navigation">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={navLinkClass}
              onClick={handleNavigation}
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/cart"
            className={navLinkClass}
            onClick={handleNavigation}
          >
            Cart ({cartCount})
          </NavLink>

          <button
            type="button"
            className="avenqio-login-button"
            style={{ alignSelf: "flex-start", marginTop: 8 }}
            onClick={() => {
              handleNavigation();
              navigate("/login");
            }}
          >
            <FiUser size={17} />
            Login
          </button>
        </nav>
      )}
    </header>
  );
}


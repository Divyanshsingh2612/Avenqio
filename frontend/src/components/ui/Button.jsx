import { Link } from "react-router-dom";

export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105",

    secondary:
      "border border-white text-white hover:bg-white hover:text-black",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  if (to) {
    return (
      <Link
        to={to}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
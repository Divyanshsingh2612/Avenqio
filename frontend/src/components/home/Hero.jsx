import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white flex items-center">

      <div className="max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="inline-block bg-blue-600 px-5 py-2 rounded-full text-sm font-medium">

            Smart Shopping, Simplified

          </span>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-black leading-tight">

            Shop Smarter

            <br />

            <span className="text-blue-400">

              with AI

            </span>

          </h1>

          <p className="mt-8 text-xl text-gray-300 leading-9 max-w-xl">

            Discover products with intelligent recommendations
            smart search, and a simpler way to shop.

          </p>

          <div className="flex gap-6 mt-10">

            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-semibold transition"
            >

              Shop Now

            </Link>

            <Link
              to="/products"
              className="border border-white hover:bg-white hover:text-black px-8 py-4 rounded-full transition"
            >

              Explore

            </Link>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex justify-center"
        >

          <img
            src="/hero.png"
            alt="Hero"
            className="w-[650px] hover:scale-105 transition-all duration-500 drop-shadow-2xl"
          />

        </motion.div>

      </div>

    </section>
  );
}
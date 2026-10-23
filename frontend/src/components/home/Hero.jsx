
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiPlay,
  FiStar,
} from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] transition-colors duration-300 dark:bg-[#111113] dark:text-[#f5f5f7]">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[440px] w-[440px] rounded-full bg-blue-200/40 blur-[100px] dark:bg-blue-500/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[360px] w-[360px] rounded-full bg-violet-200/40 blur-[100px] dark:bg-violet-500/10"
      />

      <div className="relative mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:min-h-[720px] lg:grid-cols-2 lg:gap-8 lg:px-16 lg:py-24">
        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[#424245] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-[#d1d1d6]">
            <FiStar className="text-blue-600 dark:text-blue-400" />
            <span>Smart Shopping, Simplified</span>
          </div>

          <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px]">
            Find what
            <br />
            moves you
            <span className="text-blue-600 dark:text-blue-400">.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#6e6e73] dark:text-[#a1a1a6] sm:text-lg lg:mx-0 lg:text-xl">
            Discover thoughtful technology, everyday essentials, and
            products you'll love — all in one effortless shopping
            experience.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/products"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#1d1d1f] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-gray-200"
            >
              Explore products
              <FiArrowRight size={17} />
            </Link>

            <Link
              to="/products"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/60 px-7 py-4 text-sm font-semibold text-[#1d1d1f] transition duration-200 hover:border-black/20 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <FiPlay size={15} />
              Discover Avenqio
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#6e6e73] dark:text-[#a1a1a6] lg:justify-start">
            <span className="inline-flex items-center gap-2">
              <FiCheck className="text-blue-600 dark:text-blue-400" />
              Easy discovery
            </span>

            <span className="inline-flex items-center gap-2">
              <FiCheck className="text-blue-600 dark:text-blue-400" />
              Smarter shopping
            </span>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: "easeOut" }}
          className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-none"
        >
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-200/50 via-white/30 to-violet-200/50 blur-3xl dark:from-blue-500/15 dark:via-white/5 dark:to-violet-500/15" />

          <div className="relative w-full">
            <img
              src="/hero.png"
              alt="Discover your next favorite products with Avenqio"
              fetchPriority="high"
              className="relative mx-auto aspect-square w-full max-w-[580px] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.10)] transition-transform duration-700 ease-out hover:scale-[1.025]"
            />

            <div className="absolute bottom-4 left-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#242426]/85 sm:bottom-8 sm:left-0 sm:px-5">
              <p className="text-xs font-medium text-[#6e6e73] dark:text-[#a1a1a6]">
                YOUR NEXT DISCOVERY
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1d1d1f] dark:text-white sm:text-base">
                Something you'll love.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

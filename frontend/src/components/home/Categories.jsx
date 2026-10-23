
import { motion } from "framer-motion";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiGrid,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Phones",
    subtitle: "Power in your pocket.",
    icon: FiSmartphone,
    color: "from-blue-100 to-sky-50",
    darkColor: "dark:from-blue-500/15 dark:to-sky-500/5",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Laptops",
    subtitle: "Ideas, without limits.",
    icon: FiMonitor,
    color: "from-violet-100 to-purple-50",
    darkColor: "dark:from-violet-500/15 dark:to-purple-500/5",
    accent: "text-violet-600 dark:text-violet-400",
  },
  {
    name: "Audio",
    subtitle: "Hear every detail.",
    icon: FiHeadphones,
    color: "from-amber-100 to-orange-50",
    darkColor: "dark:from-amber-500/15 dark:to-orange-500/5",
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Gaming",
    subtitle: "Enter another world.",
    icon: FiGrid,
    color: "from-emerald-100 to-teal-50",
    darkColor: "dark:from-emerald-500/15 dark:to-teal-500/5",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function Categories() {
  return (
    <section className="bg-white px-5 py-20 text-[#1d1d1f] transition-colors duration-300 dark:bg-[#111113] dark:text-[#f5f5f7] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Explore Avenqio
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Find your category.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#6e6e73] dark:text-[#a1a1a6] sm:text-lg">
              Thoughtfully selected tech for the way you live, work, and play.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all products
            <FiArrowUpRight size={17} />
          </Link>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className={`group relative flex min-h-[235px] flex-col overflow-hidden rounded-[26px] border border-black/[0.05] bg-gradient-to-br ${category.color} ${category.darkColor} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 dark:border-white/[0.08] dark:hover:shadow-black/20 sm:min-h-[260px] sm:p-7`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/[0.04] transition-transform duration-300 group-hover:scale-110 dark:bg-white/[0.08] dark:ring-white/[0.08] ${category.accent}`}
                    >
                      <Icon size={23} strokeWidth={1.7} />
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-[#6e6e73] transition-all duration-300 group-hover:bg-white group-hover:text-[#1d1d1f] dark:bg-white/[0.06] dark:text-[#d1d1d6] dark:group-hover:bg-white/15 dark:group-hover:text-white">
                      <FiArrowUpRight size={18} />
                    </span>
                  </div>

                  <div className="mt-auto pt-10">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#6e6e73] dark:text-[#a1a1a6]">
                      {category.subtitle}
                    </p>
                  </div>

                  {/* Decorative background glow */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-transform duration-500 group-hover:scale-150 dark:bg-white/[0.04] ${category.accent}`}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

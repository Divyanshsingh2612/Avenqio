import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-8">
        <SectionTitle
          title="Featured Products"
          subtitle="Discover our most popular products"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
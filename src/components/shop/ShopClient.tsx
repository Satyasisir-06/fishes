"use client";

import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
};

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "fish", label: "Fish" },
  { id: "tank", label: "Aquariums" },
  { id: "food", label: "Fish Food" },
  { id: "decor", label: "Decor & Plants" },
  { id: "other", label: "Other" }
];

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters (Desktop) / Horizontal Scroll (Mobile) */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="text-lg font-bold text-foreground mb-4 hidden md:block">Categories</h3>
          
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeCategory === cat.id
                    ? "bg-accent text-primary shadow-sm"
                    : "bg-surface text-muted hover:text-foreground hover:bg-surface/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface rounded-3xl border border-surface/50 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-muted mb-4">
              <span className="text-2xl">🐟</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted">There are no products in the "{CATEGORIES.find(c => c.id === activeCategory)?.label}" category right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartBtn({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // In case it's inside a Link
        addToCart(product);
      }}
      disabled={product.stock === 0}
      className="p-2.5 bg-primary rounded-xl text-accent hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-accent group-hover:text-primary shadow-sm z-10"
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}

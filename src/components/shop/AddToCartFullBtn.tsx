"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartFullBtn({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      disabled={product.stock === 0}
      className="w-full py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]"
    >
      <ShoppingCart className="w-5 h-5" /> Add to Cart
    </button>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  qty: number;
  stock: number;
};

export type AppliedCoupon = {
  code: string;
  discount_percent: number;
  description: string;
  max_uses: number;
  used_count: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  discountedTotal: number;
  couponDiscount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("kicchu_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kicchu_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: any, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => 
          i.id === product.id 
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) } 
            : i
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        qty: qty,
        stock: product.stock
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => 
      prev.map((i) => i.id === id ? { ...i, qty: Math.min(qty, i.stock) } : i)
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, error: "Please enter a coupon code." };
    }

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "coupons")
        .single();

      if (!data?.value) {
        return { success: false, error: "No coupons available." };
      }

      const coupons = JSON.parse(data.value) as any[];
      const match = coupons.find(
        (c: any) => c.code?.toUpperCase() === trimmed && c.is_active
      );

      if (!match) {
        return { success: false, error: "Invalid or expired coupon code." };
      }

      // Check usage limit
      const maxUses = match.max_uses ?? 0;
      const usedCount = match.used_count ?? 0;
      if (maxUses > 0 && usedCount >= maxUses) {
        return { success: false, error: "This coupon has reached its usage limit." };
      }

      setAppliedCoupon({
        code: match.code,
        discount_percent: match.discount_percent,
        description: match.description,
        max_uses: maxUses,
        used_count: usedCount,
      });
      return { success: true };
    } catch {
      return { success: false, error: "Failed to validate coupon. Try again." };
    }
  }, []);

  const cartTotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const couponDiscount = appliedCoupon ? Math.round(cartTotal * appliedCoupon.discount_percent / 100) : 0;
  const discountedTotal = cartTotal - couponDiscount;
  const cartCount = items.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQty, cartTotal, cartCount, 
      isCartOpen, setIsCartOpen, clearCart,
      appliedCoupon, applyCoupon, removeCoupon, discountedTotal, couponDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

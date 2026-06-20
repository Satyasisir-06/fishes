"use client";

import { useCart } from "./CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, Tag, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountedTotal, couponDiscount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ type: "loading" | "success" | "error"; message: string } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || couponStatus?.type === "loading") return;
    setCouponStatus({ type: "loading", message: "Validating..." });
    const result = await applyCoupon(couponInput);
    if (result.success) {
      setCouponStatus({ type: "success", message: "Coupon applied!" });
      setTimeout(() => setCouponStatus(null), 2000);
    } else {
      setCouponStatus({ type: "error", message: result.error || "Invalid coupon" });
    }
  };

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full flex flex-col bg-surface shadow-2xl border-l border-white/5 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-muted hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-muted mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted mb-6">Looks like you haven't added any aquatic friends yet.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-primary rounded-2xl border border-white/5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted">No Img</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-foreground line-clamp-2 text-sm">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-bold text-accent mb-3">₹{item.price.toLocaleString("en-IN")}</div>
                    
                    <div className="flex items-center gap-3 mt-auto">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-foreground hover:bg-white/10"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-foreground hover:bg-white/10 disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Section */}
          {items.length > 0 && !appliedCoupon && (
            <div className="px-6 py-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full bg-primary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponInput.trim() || couponStatus?.type === "loading"}
                  className="px-4 py-3 bg-surface border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
                >
                  {couponStatus?.type === "loading" ? "..." : "Apply"}
                </button>
              </div>
              {couponStatus && (
                <div className={`flex items-center gap-1.5 mt-2 text-xs ${
                  couponStatus.type === "success" ? "text-green-500" : "text-danger"
                }`}>
                  {couponStatus.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {couponStatus.message}
                </div>
              )}
            </div>
          )}

          {/* Applied Coupon Badge */}
          {items.length > 0 && appliedCoupon && (
            <div className="px-6 py-3 border-t border-white/5">
              <div className="flex items-center justify-between bg-accent/10 rounded-xl px-4 py-3 border border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground flex items-center gap-2">
                      <code className="text-accent">{appliedCoupon.code}</code>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">-{appliedCoupon.discount_percent}%</span>
                    </div>
                    <div className="text-xs text-muted">{appliedCoupon.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    setCouponInput("");
                    setCouponStatus(null);
                  }}
                  className="text-muted hover:text-danger transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-primary/50">
              {appliedCoupon && (
                <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Original</span>
                    <span className="text-foreground">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-500">Discount ({appliedCoupon.discount_percent}%)</span>
                    <span className="text-green-500">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted">Total</span>
                <span className="text-2xl font-bold text-foreground">₹{(appliedCoupon ? discountedTotal : cartTotal).toLocaleString("en-IN")}</span>
              </div>
              
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-[0_0_20px_rgba(0,212,170,0.2)]"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

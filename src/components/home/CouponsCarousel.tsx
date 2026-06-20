"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CouponCard from "./CouponCard";

interface CouponData {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  is_active: boolean;
}

export default function CouponsCarousel({ coupons }: { coupons: CouponData[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = coupons.length;

  const next = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [total, next]);

  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 w-full justify-center">
        <button
          onClick={prev}
          className="shrink-0 w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/30 transition-all"
          aria-label="Previous coupon"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="overflow-hidden w-full max-w-[320px] sm:max-w-[620px] lg:max-w-[940px]">
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIdx * 310}px)` }}
          >
            {coupons.map((coupon) => (
              <div key={coupon.id} className="shrink-0 w-[280px] sm:w-[300px]">
                <CouponCard coupon={coupon} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="shrink-0 w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/30 transition-all"
          aria-label="Next coupon"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {coupons.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIdx ? "bg-accent w-6" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

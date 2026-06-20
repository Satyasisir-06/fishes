"use client";

import { useState } from "react";
import { Copy, Check, Percent } from "lucide-react";

interface CouponData {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  is_active: boolean;
}

export default function CouponCard({ coupon }: { coupon: CouponData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative glass-card rounded-2xl p-6 overflow-hidden group hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5">
      {/* Background accent glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-accent/5 rounded-full blur-[40px] group-hover:bg-accent/10 transition-colors pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Percent className="w-4 h-4 text-accent" />
          </div>
          <span className="text-3xl font-black text-foreground">{coupon.discount_percent}%</span>
          <span className="text-xs font-bold text-muted uppercase tracking-wider mt-2">OFF</span>
        </div>

        <p className="text-sm text-muted mb-4 line-clamp-2">{coupon.description}</p>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-primary/60 border border-white/10 rounded-xl px-4 py-2.5">
            <code className="text-sm font-mono text-accent font-bold tracking-wider">{coupon.code}</code>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 w-10 h-10 flex items-center justify-center bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors active:scale-95"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Tag } from "lucide-react";
import CouponsCarousel from "./CouponsCarousel";

interface CouponData {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  is_active: boolean;
}

export default async function CouponsSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "coupons")
    .single();

  let coupons: CouponData[] = [];

  if (data?.value) {
    try {
      const parsed = JSON.parse(data.value) as CouponData[];
      coupons = parsed.filter((c) => c.is_active);
    } catch {
      // no coupons
    }
  }

  if (coupons.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-primary relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-accent" />
              <span className="text-xs uppercase tracking-widest font-bold text-muted">Save More</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Exclusive Coupons</h2>
            <p className="text-muted mt-2">Limited-time offers — copy a code and use it at checkout.</p>
          </div>
        </div>

        <CouponsCarousel coupons={coupons} />
      </div>
    </section>
  );
}

"use server";

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function processOrder(formData: {
  customerName: string;
  customerPhone: string;
  notes: string;
  items: any[];
  totalAmount: number;
  couponCode?: string | null;
  couponDiscount?: number;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const pickupCode = crypto.randomBytes(3).toString("hex").toUpperCase();

  // Insert Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        pickup_code: pickupCode,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        notes: formData.notes || "",
        items: formData.items,
        total_amount: formData.totalAmount,
        status: "pending",
        coupon_code: formData.couponCode || null,
        coupon_discount: formData.couponDiscount || 0,
      }
    ])
    .select()
    .single();

  if (orderError) {
    console.error("Order error", orderError);
    return { success: false, error: orderError.message };
  }

  // Decrement Stock
  for (const item of formData.items) {
    const { data: product } = await supabase.from("products").select("stock").eq("id", item.id).single();
    if (product) {
      await supabase
        .from("products")
        .update({ stock: Math.max(0, product.stock - item.qty) })
        .eq("id", item.id);
    }
  }

  // Increment coupon usage count
  if (formData.couponCode) {
    const { data: couponSettings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "coupons")
      .single();

    if (couponSettings?.value) {
      try {
        const coupons = JSON.parse(couponSettings.value);
        const updated = coupons.map((c: any) => {
          if (c.code?.toUpperCase() === formData.couponCode?.toUpperCase()) {
            return { ...c, used_count: (c.used_count || 0) + 1 };
          }
          return c;
        });
        await supabase
          .from("settings")
          .upsert({ key: "coupons", value: JSON.stringify(updated) }, { onConflict: "key" });
      } catch {
        // Non-critical: log but don't fail the order
        console.error("Failed to increment coupon usage count");
      }
    }
  }

  return { success: true, pickupCode: order.pickup_code };
}

"use server";

import { createClient } from "@supabase/supabase-js";

export async function getOrderStatus(pickupCode: string, phone: string) {
  // We use service role key here because public users don't have SELECT permission on orders
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select("pickup_code, status, total_amount, items, created_at")
    .eq("pickup_code", pickupCode.trim().toUpperCase())
    .eq("customer_phone", phone.trim())
    .single();

  if (error || !order) {
    return { success: false, error: "Order not found. Please check your pickup code and phone number." };
  }

  return { success: true, order };
}

export async function getOrdersByPhone(phone: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders, error } = await supabase
    .from("orders")
    .select("pickup_code, status, total_amount, created_at, items")
    .eq("customer_phone", phone.trim())
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !orders || orders.length === 0) {
    return { success: false, error: "No recent orders found for this phone number." };
  }

  return { success: true, orders };
}


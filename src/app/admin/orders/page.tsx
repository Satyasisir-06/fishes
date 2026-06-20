import { createClient } from "@/lib/supabase/server";
import OrdersClient from "@/components/admin/OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Manage Orders</h1>
        <OrdersClient initialOrders={orders || []} />
      </div>
    </div>
  );
}

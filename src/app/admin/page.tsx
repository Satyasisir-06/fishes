import { createClient } from "@/lib/supabase/server";
import { Package, Clock, CheckCircle2, IndianRupee } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const allOrders = orders || [];
  
  // Calculate stats
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === "pending").length;
  const readyOrders = allOrders.filter(o => o.status === "ready").length;
  
  // Revenue today
  const today = new Date().toISOString().split("T")[0];
  const revenueToday = allOrders
    .filter(o => o.created_at.startsWith(today) && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const recentOrders = allOrders.slice(0, 10);

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface p-6 rounded-3xl border border-surface flex flex-col">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{totalOrders}</div>
            <div className="text-sm font-medium text-muted">Total Orders</div>
          </div>
          
          <div className="bg-surface p-6 rounded-3xl border border-surface flex flex-col">
            <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{pendingOrders}</div>
            <div className="text-sm font-medium text-muted">Pending Action</div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-surface flex flex-col">
            <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{readyOrders}</div>
            <div className="text-sm font-medium text-muted">Ready for Pickup</div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-surface flex flex-col">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <IndianRupee className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">₹{revenueToday.toLocaleString("en-IN")}</div>
            <div className="text-sm font-medium text-muted">Revenue Today</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Order Code</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-accent">{o.pickup_code}</td>
                      <td className="p-4">
                        <div className="text-foreground font-medium">{o.customer_name}</div>
                        <div className="text-xs text-muted">{o.customer_phone}</div>
                      </td>
                      <td className="p-4 font-bold text-foreground">₹{o.total_amount.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          o.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                          o.status === 'confirmed' ? 'bg-blue-400/10 text-blue-400' :
                          o.status === 'ready' ? 'bg-accent/10 text-accent' :
                          o.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          'bg-danger/10 text-danger'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

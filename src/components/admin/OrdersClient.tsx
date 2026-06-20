"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin-orders";
import { Filter } from "lucide-react";

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdating(id);
    const result = await updateOrderStatus(id, newStatus);
    if (result.success) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status");
    }
    setIsUpdating(null);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <Filter className="w-5 h-5 text-muted mr-2" />
        {["all", "pending", "confirmed", "ready", "completed", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors border ${
              filter === f 
                ? "bg-accent/10 border-accent text-accent" 
                : "bg-surface border-white/5 text-muted hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Pickup Code</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Items</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className={`border-b border-white/5 transition-colors ${isUpdating === o.id ? 'opacity-50' : 'hover:bg-white/5'}`}>
                    <td className="p-4 font-black text-accent text-lg">{o.pickup_code}</td>
                    <td className="p-4">
                      <div className="text-foreground font-bold">{o.customer_name}</div>
                      <div className="text-xs text-muted">{o.customer_phone}</div>
                      {o.notes && <div className="text-xs text-yellow-400 mt-1 flex gap-1"><span>📝</span>{o.notes}</div>}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {o.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-muted"><span className="text-foreground font-bold">{item.qty}x</span> {item.name}</div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-foreground">₹{o.total_amount.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={isUpdating === o.id}
                        className={`bg-primary border border-white/10 rounded-lg px-3 py-2 text-sm font-bold uppercase focus:outline-none focus:border-accent appearance-none cursor-pointer ${
                          o.status === 'pending' ? 'text-yellow-400' :
                          o.status === 'confirmed' ? 'text-blue-400' :
                          o.status === 'ready' ? 'text-accent' :
                          o.status === 'completed' ? 'text-green-500' :
                          'text-danger'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-muted">{new Date(o.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

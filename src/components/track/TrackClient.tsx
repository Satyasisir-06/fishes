"use client";

import { useState } from "react";
import { getOrderStatus, getOrdersByPhone } from "@/lib/actions/track-order";
import { Search, Package, Clock, CheckCircle2, AlertCircle, Phone, X } from "lucide-react";

export default function TrackClient() {
  const [searchType, setSearchType] = useState<"code" | "phone">("code");
  const [pickupCode, setPickupCode] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);

  const handleSearchByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrder(null);
    setOrdersList([]);

    const result = await getOrderStatus(pickupCode, phone);
    if (result.success) {
      setOrder(result.order);
    } else {
      setError(result.error || "Failed to fetch order");
    }
    setIsLoading(false);
  };

  const handleSearchByPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrder(null);
    setOrdersList([]);

    const result = await getOrdersByPhone(phone);
    if (result.success && result.orders) {
      if (result.orders.length === 1) {
        setOrder(result.orders[0]); // Auto select if only 1
      } else {
        setOrdersList(result.orders);
      }
    } else {
      setError(result.error || "Failed to fetch orders");
    }
    setIsLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, text: 'Pending Confirmation' };
      case 'confirmed':
        return { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Package, text: 'Confirmed & Preparing' };
      case 'ready':
        return { color: 'text-accent', bg: 'bg-accent/10', icon: CheckCircle2, text: 'Ready for Pickup' };
      case 'completed':
        return { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2, text: 'Completed' };
      case 'cancelled':
        return { color: 'text-danger', bg: 'bg-danger/10', icon: AlertCircle, text: 'Cancelled' };
      default:
        return { color: 'text-muted', bg: 'bg-white/5', icon: Clock, text: status };
    }
  };

   const renderOrderCard = (o: any) => {
    const statusInfo = getStatusDisplay(o.status);
    const StatusIcon = statusInfo.icon;
    
    return (
      <div className="bg-surface rounded-3xl border border-surface overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">Order Details</h2>
            <div className="text-sm text-muted">Placed on {new Date(o.created_at).toLocaleDateString()}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted uppercase tracking-widest mb-1">Code</div>
              <div className="text-xl font-black text-accent">{o.pickup_code}</div>
            </div>
            <button
              onClick={() => setOrder(null)}
              className="p-2 text-muted hover:text-foreground hover:bg-white/5 rounded-full transition-colors flex-shrink-0"
              aria-label="Close order details"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div className={`p-4 rounded-xl border border-white/5 flex items-center gap-4 ${statusInfo.bg}`}>
            <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
            <div>
              <div className="text-sm text-muted">Current Status</div>
              <div className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.text}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">Items</h3>
            <div className="flex flex-col gap-3">
              {o.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-primary rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent">{item.qty}x</span>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-muted font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-foreground">₹{o.total_amount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Tabs */}
      <div className="flex p-1 bg-surface rounded-xl">
        <button 
          onClick={() => setSearchType("code")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${searchType === "code" ? "bg-accent text-primary" : "text-muted hover:text-foreground"}`}
        >
          I have my code
        </button>
        <button 
          onClick={() => setSearchType("phone")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${searchType === "phone" ? "bg-accent text-primary" : "text-muted hover:text-foreground"}`}
        >
          Forgot code?
        </button>
      </div>

      {/* Search Forms */}
      <div className="bg-surface p-6 rounded-3xl border border-surface flex flex-col gap-4 shadow-xl">
        {searchType === "code" ? (
          <form onSubmit={handleSearchByCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Pickup Code</label>
              <input 
                type="text" 
                required 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent uppercase"
                value={pickupCode}
                onChange={e => setPickupCode(e.target.value)}
                placeholder="e.g. A1B2C3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Phone Number</label>
              <input 
                type="tel" 
                required 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter the number used at checkout"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !pickupCode || !phone}
              className="mt-2 w-full py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all disabled:opacity-50"
            >
              {isLoading ? "Searching..." : <><Search className="w-5 h-5" /> Track Order</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSearchByPhone} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Phone Number</label>
              <input 
                type="tel" 
                required 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter the number used at checkout"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !phone}
              className="mt-2 w-full py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all disabled:opacity-50"
            >
              {isLoading ? "Searching..." : <><Phone className="w-5 h-5" /> Find My Orders</>}
            </button>
          </form>
        )}

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm mt-2">
            {error}
          </div>
        )}
      </div>

      {/* Single Order Result */}
      {order && renderOrderCard(order)}

      {/* Multiple Orders Result */}
      {!order && ordersList.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-foreground">Your Recent Orders</h3>
          {ordersList.map(o => (
            <button 
              key={o.pickup_code}
              onClick={() => {
                setOrder(o);
              }}
              className="bg-surface p-4 rounded-2xl border border-white/5 hover:border-accent/50 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-xs text-muted mb-1">{new Date(o.created_at).toLocaleDateString()}</div>
                <div className="font-bold text-foreground group-hover:text-accent transition-colors">
                  {o.items.length} items • ₹{o.total_amount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted uppercase tracking-widest mb-1">Code</div>
                <div className="text-lg font-black text-accent">{o.pickup_code}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

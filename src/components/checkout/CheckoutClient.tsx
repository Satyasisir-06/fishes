"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { processOrder } from "@/lib/actions/checkout";
import { ArrowRight, CheckCircle2, Tag, XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutClient({ qrCodeUrl }: { qrCodeUrl: string }) {
  const { items, cartTotal, discountedTotal, couponDiscount, appliedCoupon, removeCoupon, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [pickupCode, setPickupCode] = useState("");

  if (items.length === 0 && step !== 3) {
    return (
      <div className="bg-surface p-8 rounded-3xl border border-surface text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-accent hover:underline">Go back to shop</Link>
      </div>
    );
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setStep(2);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    const finalTotal = appliedCoupon ? discountedTotal : cartTotal;
    const result = await processOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      notes: formData.notes,
      items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      totalAmount: finalTotal,
      couponCode: appliedCoupon?.code || null,
      couponDiscount: couponDiscount,
    });

    if (result.success && result.pickupCode) {
      setPickupCode(result.pickupCode);
      clearCart();
      setStep(3);
    } else {
      alert("Error processing order: " + result.error);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
      {/* Progress Bar */}
      <div className="flex border-b border-white/5">
        <div className={`flex-1 py-4 text-center text-sm font-bold ${step >= 1 ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-muted'}`}>
          1. Details
        </div>
        <div className={`flex-1 py-4 text-center text-sm font-bold ${step >= 2 ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-muted'}`}>
          2. Payment
        </div>
        <div className={`flex-1 py-4 text-center text-sm font-bold ${step === 3 ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-muted'}`}>
          3. Done
        </div>
      </div>

      <div className="p-6 md:p-8">
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-foreground">Pickup Details</h2>

            {/* Applied Coupon Badge */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-accent/10 rounded-xl px-4 py-3 border border-accent/20">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Coupon: <code className="text-accent">{appliedCoupon.code}</code>
                      <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">-{appliedCoupon.discount_percent}%</span>
                    </div>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-muted hover:text-danger transition-colors" title="Remove coupon">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Full Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                required 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">WhatsApp / Phone Number <span className="text-danger">*</span></label>
              <input 
                type="tel" 
                required 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Pickup Notes (Optional)</label>
              <textarea 
                className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent resize-none h-24"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="E.g., I will come tomorrow evening."
              />
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-muted text-center sm:text-left w-full sm:w-auto">
                {appliedCoupon ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-through text-muted">₹{cartTotal.toLocaleString("en-IN")}</span>
                      <span className="text-green-500 font-bold">-{appliedCoupon.discount_percent}%</span>
                    </div>
                    <span className="text-foreground font-bold text-xl">₹{discountedTotal.toLocaleString("en-IN")}</span>
                  </>
                ) : (
                  <>
                    Total to pay: <span className="text-foreground font-bold text-xl block sm:inline">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </>
                )}
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all"
              >
                Proceed to Pay <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl font-bold text-foreground">Scan to Pay</h2>
            <p className="text-muted max-w-sm">Please scan the QR code below with any UPI app to complete your payment.</p>
            
            <div className="p-4 bg-white rounded-2xl w-64 h-64 flex items-center justify-center relative shadow-2xl">
               <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
            </div>
            
            <div className="text-3xl font-extrabold text-foreground tracking-tight">
              ₹{(appliedCoupon ? discountedTotal : cartTotal).toLocaleString("en-IN")}
            </div>

            <div className="w-full max-w-sm p-4 bg-primary/50 rounded-xl border border-accent/20 text-sm text-accent mb-4">
              Do not close this page. Click the button below <b>after</b> your payment is successful.
            </div>

            <button 
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full max-w-sm py-4 bg-accent text-primary font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "I have paid"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            
            <h2 className="text-3xl font-bold text-foreground">Order Confirmed!</h2>
            <p className="text-muted max-w-sm">Thank you for your purchase. Please show the unique pickup code below at the store counter to collect your items.</p>
            
            <div className="p-6 bg-primary rounded-2xl border border-accent/30 w-full max-w-xs mt-4 shadow-xl">
              <div className="text-sm font-medium text-muted uppercase tracking-widest mb-2">Pickup Code</div>
              <div className="text-4xl font-black text-accent tracking-[0.2em]">{pickupCode}</div>
            </div>

            <Link 
              href="/shop"
              className="mt-8 px-8 py-3 bg-surface text-foreground font-bold rounded-xl hover:bg-white/5 transition-colors border border-white/10"
            >
              Return to Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

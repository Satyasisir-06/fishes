import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = await createClient();
  
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "qr_code_url")
    .single();

  const qrUrl = settings?.value || "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=kicchu-payment";

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-extrabold text-foreground mb-8">Checkout</h1>
        <CheckoutClient qrCodeUrl={qrUrl} />
      </div>
    </div>
  );
}

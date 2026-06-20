import { createClient } from "@/lib/supabase/server";
import ShopClient from "@/components/shop/ShopClient";

// Opt out of static rendering so we fetch fresh data
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Our Collection</h1>
          <p className="text-muted">Browse our finest selection of pet fish, premium aquariums, and quality accessories.</p>
        </div>

        <ShopClient initialProducts={products || []} />
      </div>
    </div>
  );
}

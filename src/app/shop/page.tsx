import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ShopClient from "@/components/shop/ShopClient";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";

// Revalidate every 60 seconds (1 minute) for fresh data while enabling caching
export const revalidate = 60;

async function ShopProducts() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return <ShopClient initialProducts={products || []} />;
}

export default function ShopPage() {
  return (
    <div className="flex-1 bg-primary pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-2">
          <h1 className="text-4xl font-serif font-extrabold text-foreground mb-4">Our Collection</h1>
          <p className="text-muted">Browse our finest selection of pet fish, premium aquariums, and quality accessories.</p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopProducts />
        </Suspense>
      </div>
    </div>
  );
}

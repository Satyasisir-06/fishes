import { createClient } from "@/lib/supabase/server";
import ProductsClient from "@/components/admin/ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Manage Products</h1>
        <ProductsClient initialProducts={products || []} />
      </div>
    </div>
  );
}

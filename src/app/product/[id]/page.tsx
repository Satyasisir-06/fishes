import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, Check } from "lucide-react";
import AddToCartFullBtn from "@/components/shop/AddToCartFullBtn";

// Server component
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/shop" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface border border-surface shadow-2xl">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-serif font-bold text-accent uppercase tracking-widest">{product.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="text-3xl font-serif font-bold text-foreground mb-6 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <div className="prose prose-invert prose-p:text-muted max-w-none mb-8">
              <p>{product.description || "Premium quality item for your aquatic collection."}</p>
            </div>

            <div className="mb-8 p-4 bg-surface rounded-2xl border border-surface flex items-start gap-3">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-muted">
                Available for in-store pickup only. You will receive a unique code upon checkout to present at the counter.
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-surface flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-medium">Availability</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-accent text-sm font-bold">
                    <Check className="w-4 h-4" /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-danger text-sm font-bold">Out of Stock</span>
                )}
              </div>
              
              <AddToCartFullBtn product={product} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

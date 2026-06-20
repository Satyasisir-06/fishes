import Link from "next/link";
import AddToCartBtn from "./AddToCartBtn";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-accent/20">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-primary/50">
        {/* Placeholder if no image */}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted text-sm">
            No Image
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-[#f59e0b]/90 text-primary text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-[#ef4444]/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors line-clamp-1 mb-2">
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold text-foreground tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <AddToCartBtn product={product} />
        </div>
      </div>
    </div>
  );
}

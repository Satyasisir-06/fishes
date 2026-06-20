"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface rounded-2xl overflow-hidden border border-surface/50 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-surface/60 relative" />

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col p-4">
        {/* Title Skeleton */}
        <div className="h-4 bg-surface/60 rounded mb-3 w-3/4" />
        
        {/* Category Skeleton */}
        <div className="h-3 bg-surface/60 rounded mb-4 w-1/2" />

        {/* Price Skeleton */}
        <div className="h-5 bg-surface/60 rounded mb-4 w-2/5" />

        {/* Stock Skeleton */}
        <div className="h-3 bg-surface/60 rounded mb-4 w-1/3" />

        {/* Button Skeleton */}
        <div className="h-10 bg-accent/30 rounded-lg mt-auto w-full" />
      </div>
    </div>
  );
}

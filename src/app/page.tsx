import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BannerCarousel from "@/components/home/BannerCarousel";
import CouponsSection from "@/components/home/CouponsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Liquid Glass gradient overlays */}
          <div className="absolute inset-0 bg-primary/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-center md:text-left relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/40 border border-white/10 text-foreground text-xs uppercase tracking-widest font-medium backdrop-blur-md mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Exclusive Premium Stock
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground text-balance mb-6 leading-tight">
                Refined Aquatic <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#38bdf8]">Living.</span>
              </h1>
              
              <p className="text-lg text-muted/90 max-w-xl mx-auto md:mx-0 text-balance mb-10 leading-relaxed">
                Elevate your space with our curated selection of premium exotic fish, luxurious aquascapes, and expert-approved accessories.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link 
                  href="/shop" 
                  className="w-full sm:w-auto px-8 py-4 bg-foreground text-primary font-bold rounded-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Collection <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/shop?category=tanks" 
                  className="w-full sm:w-auto px-8 py-4 glass-card text-foreground font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  View Habitats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Carousel — managed via admin settings */}
      <BannerCarousel />

      {/* Coupons Section — managed via admin settings */}
      <CouponsSection />
    </div>
  );
}

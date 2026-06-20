"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const overlayLayerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      // Recalculate section position to handle layout shifts (e.g., async banners)
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionHeight = section.offsetHeight;
      const scrollThrough = Math.max(
        0,
        Math.min(sectionHeight, scrollY - sectionTop)
      );

      // ── Layer 0: Video background (deepest) ──
      // Pulled back by 35% → appears to move at 65% of scroll speed
      if (videoLayerRef.current) {
        const translateY = scrollThrough * 0.35;
        const scale = 1 + (scrollThrough / sectionHeight) * 0.04;
        videoLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      }

      // ── Layer 1: Gradient overlays (mid depth) ──
      // Pulled back by 18% → appears to move at 82% of scroll speed
      if (overlayLayerRef.current) {
        const translateY = scrollThrough * 0.18;
        overlayLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }

      // ── Layer 2: Content (closest — mostly scrolls naturally) ──
      if (contentLayerRef.current) {
        const progress = scrollThrough / sectionHeight;
        const translateY = scrollThrough * 0.05;
        const opacity = 1 - Math.min(progress * 0.25, 0.25);
        contentLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
        contentLayerRef.current.style.opacity = String(opacity);
      }

      rafId = null;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateParallax();
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-16 pb-24 lg:pt-32 lg:pb-40"
    >
      {/* ── Layer 0: Video Background (deepest, slowest parallax) ── */}
      <div
        ref={videoLayerRef}
        className="absolute inset-0 w-full h-full z-0 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Layer 1: Gradient Overlays (mid depth) ── */}
      <div
        ref={overlayLayerRef}
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      </div>

      {/* ── Layer 2: Content (closest, scrolls naturally) ── */}
      <div
        ref={contentLayerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="max-w-2xl text-center md:text-left relative overflow-hidden group">
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/40 border border-white/10 text-foreground text-xs uppercase tracking-widest font-medium backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Exclusive Premium Stock
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground text-balance mb-6 leading-tight">
              Refined Aquatic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#38bdf8]">
                Living.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg font-serif text-muted/90 max-w-xl mx-auto md:mx-0 text-balance mb-10 leading-relaxed">
              Elevate your space with our curated selection of premium exotic fish,
              luxurious aquascapes, and expert-approved accessories.
            </p>

            {/* CTAs */}
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
  );
}

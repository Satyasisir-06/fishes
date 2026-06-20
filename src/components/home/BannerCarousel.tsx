"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  bg_color: string;
  text_color: string;
  gradient_from: string;
  gradient_to: string;
  is_active: boolean;
  badge_text: string;
}

const fallbackBanners: BannerData[] = [
  {
    id: "fallback-1",
    title: "Summer Sale — Up to 40% Off",
    subtitle: "On all premium exotic fish and aquascape essentials. Limited time offer.",
    cta_text: "Shop the Sale",
    cta_link: "/shop",
    image_url: "",
    bg_color: "#0F172A",
    text_color: "#F8FAFC",
    gradient_from: "#0ea5e9",
    gradient_to: "#3b82f6",
    is_active: true,
    badge_text: "Limited Offer",
  },
];

export default function BannerCarousel() {
  const [banners, setBanners] = useState<BannerData[]>(fallbackBanners);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("value")
      .eq("key", "home_banners")
      .single()
      .then(({ data }) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value) as BannerData[];
            const active = parsed.filter((b) => b.is_active);
            if (active.length > 0) {
              setBanners(active);
            } else {
              setBanners([]);
            }
          } catch {
            // use fallback
          }
        }
        setLoaded(true);
      });
  }, []);

  const total = banners.length;

  const goTo = useCallback((idx: number) => {
    if (idx === currentIdx) return;
    setCurrentIdx(((idx % total) + total) % total);
  }, [currentIdx, total]);

  const next = useCallback(() => goTo(currentIdx + 1), [currentIdx, goTo]);
  const prev = useCallback(() => goTo(currentIdx - 1), [currentIdx, goTo]);

  // Auto-rotation - 3.5 seconds between banners
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [total, next]);

  if (!loaded) {
    return (
      <section className="py-16 sm:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] bg-surface animate-pulse" />
        </div>
      </section>
    );
  }

  if (total === 0) return null;

  const banner = banners[currentIdx];

  return (
    <section className="py-16 sm:py-20 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Banner with fade transition */}
          <div
            key={currentIdx}
            className="relative overflow-hidden rounded-3xl min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] flex items-center animate-[bannerFadeIn_400ms_ease-out]"
            style={{
              backgroundImage: banner.image_url
                ? `linear-gradient(135deg, ${banner.gradient_from}cc, ${banner.gradient_to}cc), url(${banner.image_url})`
                : `linear-gradient(135deg, ${banner.gradient_from}, ${banner.gradient_to})`,
              backgroundColor: banner.bg_color,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: banner.text_color,
            }}
          >
            {/* Dark overlay for image */}
            {banner.image_url && <div className="absolute inset-0 bg-primary/40 pointer-events-none" />}

            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Dots pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${banner.text_color} 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16 w-full" style={{ color: banner.text_color }}>
              <div className="max-w-xl">
                {banner.badge_text && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-bold mb-6 border border-white/10 hover:bg-white/20 transition-colors" style={{ color: banner.text_color }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                    {banner.badge_text}
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-balance mb-4 leading-tight">{banner.title}</h2>
                <p className="text-sm sm:text-base lg:text-lg max-w-lg text-balance mb-8 leading-relaxed" style={{ color: `${banner.text_color}cc` }}>
                  {banner.subtitle}
                </p>
                {banner.cta_text && (
                  <Link
                    href={banner.cta_link || "/shop"}
                    className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md font-bold rounded-xl border transition-all duration-300 group/link text-sm sm:text-base hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: `${banner.text_color}33`,
                      color: banner.text_color,
                      borderColor: `${banner.text_color}1a`,
                    }}
                  >
                    <span>{banner.cta_text}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute top-8 right-12 w-3 h-3 rounded-full bg-white/20 pointer-events-none" />
            <div className="absolute bottom-12 right-24 w-2 h-2 rounded-full bg-white/10 pointer-events-none" />
          </div>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Bottom controls */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIdx ? "bg-accent w-6" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

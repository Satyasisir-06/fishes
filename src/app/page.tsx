import HeroSection from "@/components/home/HeroSection";
import BannerCarousel from "@/components/home/BannerCarousel";
import CouponsSection from "@/components/home/CouponsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Banner Carousel — managed via admin settings */}
      <BannerCarousel />

      {/* Coupons Section — managed via admin settings */}
      <CouponsSection />
    </div>
  );
}

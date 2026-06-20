import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("key, value");

  const settingsMap: Record<string, string> = {};
  settings?.forEach((row) => {
    settingsMap[row.key] = row.value;
  });

  // Parse banners
  let banners: any[] = [];
  try {
    if (settingsMap["home_banners"]) {
      banners = JSON.parse(settingsMap["home_banners"]);
    }
  } catch {
    banners = [];
  }

  // Parse coupons and ensure all have max_uses / used_count
  let coupons: any[] = [];
  try {
    if (settingsMap["coupons"]) {
      coupons = JSON.parse(settingsMap["coupons"]);
      // Initialize usage tracking fields for existing coupons
      coupons = coupons.map((c: any) => ({
        ...c,
        max_uses: c.max_uses ?? 0,
        used_count: c.used_count ?? 0,
      }));
    }
  } catch {
    coupons = [];
  }

  const defaultBanner = {
    id: "banner-1",
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
  };

  if (banners.length === 0) {
    banners = [defaultBanner];
  }

  return (
    <div className="flex-1 bg-primary pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Site Settings</h1>
        <SettingsClient initialBanners={banners} initialCoupons={coupons} />
      </div>
    </div>
  );
}

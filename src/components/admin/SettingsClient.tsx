"use client";

import { useState } from "react";
import { saveBanners, saveCoupons } from "@/lib/actions/admin-settings";
import { Plus, Trash2, GripVertical, Eye, EyeOff, Save, ArrowRight, Upload, ImageIcon, Tag, Percent } from "lucide-react";
import CouponCard from "@/components/home/CouponCard";

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

interface CouponData {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  is_active: boolean;
  max_uses: number;
  used_count: number;
}

export default function SettingsClient({ initialBanners, initialCoupons }: { initialBanners: BannerData[]; initialCoupons: CouponData[] }) {
  const [activeTab, setActiveTab] = useState<"banners" | "coupons">("banners");
  const [banners, setBanners] = useState<BannerData[]>(initialBanners);
  const [coupons, setCoupons] = useState<CouponData[]>(initialCoupons);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // --- Banner management ---

  const generateId = () => `banner-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const addBanner = () => {
    const newBanner: BannerData = {
      id: generateId(),
      title: "New Banner",
      subtitle: "Edit this banner with your offer details.",
      cta_text: "Shop Now",
      cta_link: "/shop",
      image_url: "",
      bg_color: "#0F172A",
      text_color: "#F8FAFC",
      gradient_from: "#0ea5e9",
      gradient_to: "#3b82f6",
      is_active: true,
      badge_text: "New Offer",
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (id: string, field: keyof BannerData, value: string | boolean) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBanner = (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const newBanners = [...banners];
    [newBanners[idx], newBanners[targetIdx]] = [newBanners[targetIdx], newBanners[idx]];
    setBanners(newBanners);
  };

  const handleBannerImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: "error", text: "Image must be under 5MB" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    // Store as data URL temporarily; the server action will upload to Supabase Storage
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBanner(id, "image_url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveBannersAction = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const formData = new FormData();
    formData.set("banners", JSON.stringify(banners));
    const result = await saveBanners(formData);
    if (result.success) {
      // Update banners with the returned data (which has public URLs instead of data URLs)
      if (result.banners) {
        setBanners(result.banners);
      }
      setSaveMessage({ type: "success", text: "Banners saved successfully!" });
    } else {
      setSaveMessage({ type: "error", text: result.error || "Failed to save banners" });
    }
    setTimeout(() => setSaveMessage(null), 3000);
    setIsSaving(false);
  };

  // --- Coupon management ---

  const generateCouponId = () => `coupon-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const addCoupon = () => {
    const newCoupon: CouponData = {
      id: generateCouponId(),
      code: "NEW20",
      discount_percent: 20,
      description: "Save 20% on your next order",
      is_active: true,
      max_uses: 0,
      used_count: 0,
    };
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, field: keyof CouponData, value: string | number | boolean) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const saveCouponsAction = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const formData = new FormData();
    formData.set("coupons", JSON.stringify(coupons));
    const result = await saveCoupons(formData);
    if (result.success) {
      setSaveMessage({ type: "success", text: "Coupons saved successfully!" });
    } else {
      setSaveMessage({ type: "error", text: result.error || "Failed to save coupons" });
    }
    setTimeout(() => setSaveMessage(null), 3000);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-surface rounded-2xl p-1.5 border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab("banners")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "banners"
              ? "bg-accent text-primary shadow-lg"
              : "text-muted hover:text-foreground"
          }`}
        >
          Banners
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "coupons"
              ? "bg-accent text-primary shadow-lg"
              : "text-muted hover:text-foreground"
          }`}
        >
          Coupons
        </button>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between">
        <div>
          {saveMessage && (
            <span className={`text-sm font-medium ${
              saveMessage.type === "success" ? "text-green-500" : "text-danger"
            }`}>{saveMessage.text}</span>
          )}
        </div>
        <button
          onClick={activeTab === "banners" ? saveBannersAction : saveCouponsAction}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 text-sm"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : `Save ${activeTab === "banners" ? "Banners" : "Coupons"}`}
        </button>
      </div>

      {/* ===================== BANNERS TAB ===================== */}
      {activeTab === "banners" && (
        <div className="flex flex-col gap-8">
          {/* Carousel Live Preview */}
          <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-accent" />
                Carousel Preview
              </h2>
              <div className="flex items-center gap-2">
                {banners.filter(b => b.is_active).length > 1 && (
                  <div className="flex gap-1.5">
                    {banners.filter(b => b.is_active).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-accent" : "bg-white/20"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {banners.length === 0 ? (
                <div className="text-center py-12 text-muted">No banners yet. Add one below.</div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl">
                  {(() => {
                    const activeBanners = banners.filter(b => b.is_active);
                    const current = activeBanners[0] || banners[0];
                    if (!current) return null;
                    return (
                      <div
                        className="relative overflow-hidden rounded-2xl min-h-[200px] sm:min-h-[240px] flex items-center transition-all duration-500"
                        style={{
                          backgroundImage: current.image_url
                            ? `linear-gradient(135deg, ${current.gradient_from}cc, ${current.gradient_to}cc), url(${current.image_url})`
                            : `linear-gradient(135deg, ${current.gradient_from}, ${current.gradient_to})`,
                          backgroundColor: current.bg_color,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          color: current.text_color,
                        }}
                      >
                        {current.image_url && <div className="absolute inset-0 bg-primary/40 pointer-events-none"></div>}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="relative z-10 p-8 sm:p-10 w-full">
                          {current.badge_text && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] uppercase tracking-widest font-bold mb-5 border" style={{ color: current.text_color, backgroundColor: `${current.text_color}1a`, borderColor: `${current.text_color}1a` }}>
                              {current.badge_text}
                            </div>
                          )}
                          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-balance mb-3 leading-tight">{current.title}</h3>
                          <p className="text-sm sm:text-base max-w-lg text-balance mb-6 leading-relaxed" style={{ color: `${current.text_color}cc` }}>{current.subtitle}</p>
                          {current.cta_text && (
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-md font-bold rounded-xl border text-sm" style={{ color: current.text_color, backgroundColor: `${current.text_color}33`, borderColor: `${current.text_color}1a` }}>
                              {current.cta_text} <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Banner List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Manage Banners</h2>
              <button
                onClick={addBanner}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Banner
              </button>
            </div>

            {banners.map((banner, index) => (
              <BannerEditor
                key={banner.id}
                banner={banner}
                index={index}
                total={banners.length}
                onChange={updateBanner}
                onRemove={removeBanner}
                onMove={moveBanner}
                onImageSelect={handleBannerImage}
              />
            ))}

            {banners.length === 0 && (
              <div className="text-center py-16 glass-card rounded-3xl">
                <ImageIcon className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted font-medium">No banners yet</p>
                <p className="text-xs text-muted mt-1">Click "Add Banner" to create your first one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== COUPONS TAB ===================== */}
      {activeTab === "coupons" && (
        <div className="flex flex-col gap-4">
          {/* Coupons Preview */}
          <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent" />
                Coupons Preview
              </h2>
            </div>
            <div className="p-6">
              {coupons.filter(c => c.is_active).length === 0 ? (
                <div className="text-center py-8 text-muted">No active coupons to display.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.filter(c => c.is_active).map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coupon List */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Manage Coupons</h2>
            <button
              onClick={addCoupon}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Coupon
            </button>
          </div>

          {coupons.map((coupon, index) => (
            <CouponEditor
              key={coupon.id}
              coupon={coupon}
              index={index}
              onChange={updateCoupon}
              onRemove={removeCoupon}
            />
          ))}

          {coupons.length === 0 && (
            <div className="text-center py-16 glass-card rounded-3xl">
              <Percent className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted font-medium">No coupons yet</p>
              <p className="text-xs text-muted mt-1">Click "Add Coupon" to create your first discount code.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Banner Editor ====================

function BannerEditor({
  banner,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  onImageSelect,
}: {
  banner: BannerData;
  index: number;
  total: number;
  onChange: (id: string, field: keyof BannerData, value: string | boolean) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  onImageSelect: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">#{index + 1}</span>
          <span className="text-foreground font-bold line-clamp-1">{banner.title || "Untitled"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove(banner.id, "up")} disabled={index === 0} className="p-1.5 text-muted hover:text-foreground disabled:opacity-30 transition-colors"><GripVertical className="w-4 h-4 rotate-90" /></button>
          <button onClick={() => onChange(banner.id, "is_active", !banner.is_active)} className={`p-1.5 rounded-lg transition-colors ${banner.is_active ? "text-accent" : "text-muted"}`}>{banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
          <button onClick={() => onRemove(banner.id)} className="p-1.5 text-danger/70 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted">Title</label>
          <input type="text" value={banner.title} onChange={(e) => onChange(banner.id, "title", e.target.value)} className="bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted">Badge</label>
          <input type="text" value={banner.badge_text} onChange={(e) => onChange(banner.id, "badge_text", e.target.value)} placeholder="Limited Offer" className="bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-medium text-muted">Subtitle</label>
          <textarea value={banner.subtitle} onChange={(e) => onChange(banner.id, "subtitle", e.target.value)} rows={1} className="bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent text-sm resize-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted">CTA Text</label>
          <input type="text" value={banner.cta_text} onChange={(e) => onChange(banner.id, "cta_text", e.target.value)} className="bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted">CTA Link</label>
          <input type="text" value={banner.cta_link} onChange={(e) => onChange(banner.id, "cta_link", e.target.value)} className="bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-medium text-muted">Background Image</label>
          <div className="flex items-center gap-3">
            {banner.image_url ? (
              <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => onChange(banner.id, "image_url", "")} className="absolute top-1 right-1 p-0.5 bg-danger/80 rounded text-white"><Trash2 className="w-3 h-3" /></button>
              </div>
            ) : (
              <div className="w-20 h-14 rounded-xl bg-primary border border-white/10 flex items-center justify-center shrink-0"><ImageIcon className="w-5 h-5 text-muted" /></div>
            )}
            <label className="flex-1 flex items-center justify-center gap-2 bg-primary border border-white/10 border-dashed rounded-xl px-4 py-2.5 text-foreground hover:bg-white/5 hover:border-accent cursor-pointer transition-colors text-sm">
              <Upload className="w-4 h-4 text-accent" />
              <span>{banner.image_url ? "Replace" : "Upload"}</span>
              <input type="file" accept="image/*" onChange={(e) => onImageSelect(banner.id, e)} className="hidden" />
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="md:col-span-2 grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-muted">Gradient Start</label>
            <input type="color" value={banner.gradient_from} onChange={(e) => onChange(banner.id, "gradient_from", e.target.value)} className="w-full h-8 rounded-lg border border-white/10 bg-primary cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-muted">Gradient End</label>
            <input type="color" value={banner.gradient_to} onChange={(e) => onChange(banner.id, "gradient_to", e.target.value)} className="w-full h-8 rounded-lg border border-white/10 bg-primary cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-muted">Bg</label>
            <input type="color" value={banner.bg_color} onChange={(e) => onChange(banner.id, "bg_color", e.target.value)} className="w-full h-8 rounded-lg border border-white/10 bg-primary cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-muted">Text</label>
            <input type="color" value={banner.text_color} onChange={(e) => onChange(banner.id, "text_color", e.target.value)} className="w-full h-8 rounded-lg border border-white/10 bg-primary cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Coupon Editor ====================

function CouponEditor({
  coupon,
  index,
  onChange,
  onRemove,
}: {
  coupon: CouponData;
  index: number;
  onChange: (id: string, field: keyof CouponData, value: string | number | boolean) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted uppercase">#{index + 1}</span>
          <code className="text-sm font-mono text-accent font-bold">{coupon.code}</code>
          <span className="text-sm font-bold text-foreground">{coupon.discount_percent}% OFF</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(coupon.id, "is_active", !coupon.is_active)} className={`p-1.5 rounded-lg transition-colors ${coupon.is_active ? "text-accent" : "text-muted"}`}>{coupon.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
          <button onClick={() => onRemove(coupon.id)} className="p-1.5 text-danger/70 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Code</label>
          <input type="text" value={coupon.code} onChange={(e) => onChange(coupon.id, "code", e.target.value.toUpperCase())} className="bg-primary border border-white/10 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm font-mono" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Discount %</label>
          <input type="number" value={coupon.discount_percent} onChange={(e) => onChange(coupon.id, "discount_percent", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} min={0} max={100} className="bg-primary border border-white/10 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Description</label>
          <input type="text" value={coupon.description} onChange={(e) => onChange(coupon.id, "description", e.target.value)} className="bg-primary border border-white/10 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Max Uses</label>
          <div className="flex items-center gap-2">
            <input type="number" value={coupon.max_uses} onChange={(e) => onChange(coupon.id, "max_uses", Math.max(0, parseInt(e.target.value) || 0))} min={0} className="bg-primary border border-white/10 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm flex-1" />
            <span className="text-xs text-muted whitespace-nowrap">{coupon.used_count} used</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

async function uploadBase64Image(dataUrl: string): Promise<string> {
  // Only process data URLs (newly uploaded images)
  if (!dataUrl.startsWith("data:")) return dataUrl;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const matches = dataUrl.match(/^data:(image\/(\w+));base64,(.+)$/);
  if (!matches) return dataUrl;

  const mimeType = matches[1];
  const ext = matches[2] || "png";
  const base64Data = matches[3];

  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("fishes")
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Failed to upload image: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage.from("fishes").getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

export async function saveBanners(formData: FormData) {
  const bannersRaw = formData.get("banners") as string;
  if (!bannersRaw) {
    return { success: false, error: "No banner data provided." };
  }

  let banners: any[];
  try {
    banners = JSON.parse(bannersRaw);
  } catch {
    return { success: false, error: "Invalid banner data format." };
  }

  // Validate at least one banner has a title
  const hasValid = banners.some((b: any) => b.title?.trim());
  if (!hasValid) {
    return { success: false, error: "At least one banner must have a title." };
  }

  // Upload any base64 data URLs to Supabase Storage
  for (const banner of banners) {
    if (banner.image_url) {
      try {
        banner.image_url = await uploadBase64Image(banner.image_url);
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "home_banners", value: JSON.stringify(banners) }, { onConflict: "key" });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, banners };
}

export async function saveCoupons(formData: FormData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const couponsRaw = formData.get("coupons") as string;
  if (!couponsRaw) {
    return { success: false, error: "No coupon data provided." };
  }

  let coupons: any[];
  try {
    coupons = JSON.parse(couponsRaw);
  } catch {
    return { success: false, error: "Invalid coupon data format." };
  }

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "coupons", value: JSON.stringify(coupons) }, { onConflict: "key" });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProductStock(id: string, stock: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ stock }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function updateProductDetails(formData: FormData) {
  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageFile = formData.get("image") as File | null;

  let imageUrl = formData.get("current_image_url") as string;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert File to ArrayBuffer for Node environment upload
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await adminSupabase.storage
      .from('fishes')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false
      });

    if (error) {
      return { success: false, error: "Failed to upload image: " + error.message };
    }

    const { data: publicUrlData } = adminSupabase.storage
      .from('fishes')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: dbError } = await adminSupabase.from("products").update({
    name,
    category,
    price,
    image_url: imageUrl
  }).eq("id", id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, imageUrl, name, category, price };
}

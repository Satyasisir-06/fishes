"use server";

import { createClient } from "@supabase/supabase-js";

export async function syncProductsFromBucket() {
  // Use service_role key to bypass RLS and list files
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. List all files in the 'fishes' bucket
  const { data: files, error: bucketError } = await supabase.storage.from("fishes").list();

  if (bucketError) {
    console.error("Error fetching bucket:", bucketError);
    return { success: false, error: bucketError.message };
  }

  if (!files || files.length === 0) {
    return { success: false, error: "No files found in the fishes bucket." };
  }

  // Filter out system files like .emptyFolderPlaceholder
  const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder' && f.metadata);

  let addedCount = 0;

  // 2. Map files to products
  for (const file of validFiles) {
    // Determine category based on filename (e.g. "tank-1.jpg" -> "tank")
    const lowerName = file.name.toLowerCase();
    let category = "other";
    if (lowerName.includes("fish")) category = "fish";
    else if (lowerName.includes("food")) category = "food";
    else if (lowerName.includes("tank") || lowerName.includes("aquarium")) category = "tank";
    else if (lowerName.includes("decor") || lowerName.includes("plant")) category = "decor";

    // Format product name (e.g. "betta-fish.jpg" -> "Betta Fish")
    const rawName = file.name.split('.')[0].replace(/[-_]/g, ' ');
    const productName = rawName.replace(/\b\w/g, l => l.toUpperCase());

    // Generate public URL
    const { data: { publicUrl } } = supabase.storage.from("fishes").getPublicUrl(file.name);

    // Check if product already exists with this image_url
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("image_url", publicUrl)
      .single();

    if (!existing) {
      // Generate a random price between 100 and 1000
      const randomPrice = Math.floor(Math.random() * 90) * 10 + 100;
      
      const { error: insertError } = await supabase.from("products").insert({
        name: productName,
        description: `Premium ${category} item for your aquatic collection.`,
        price: randomPrice,
        category: category,
        stock: 10,
        image_url: publicUrl,
        is_active: true
      });

      if (insertError) {
        console.error("Error inserting product:", insertError);
      } else {
        addedCount++;
      }
    }
  }

  return { success: true, message: `Successfully synced ${addedCount} new products from the bucket!` };
}

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/['"]/g, '').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking bucket 'fishes'...");
  const { data: files, error: bucketError } = await supabase.storage.from('fishes').list();
  if (bucketError) {
    console.error("Bucket error:", bucketError);
  } else {
    console.log("Files in 'fishes':", files.map(f => f.name));
  }

  console.log("Checking products table...");
  const { data: products, error: dbError } = await supabase.from('products').select('*');
  if (dbError) {
    console.error("DB error:", dbError);
  } else {
    console.log(`Found ${products.length} products in DB.`);
  }
}
check();

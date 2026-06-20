-- Supabase Schema for Kicchu Fish Store

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text NOT NULL,
    stock integer NOT NULL DEFAULT 0,
    image_url text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pickup_code text UNIQUE NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    items jsonb NOT NULL,
    total_amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    notes text,
    coupon_code text,
    coupon_discount numeric NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.settings (
    key text PRIMARY KEY,
    value text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'admin',
    display_name text
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- PRODUCTS
-- Public can read active products
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- Admins can do everything on products
CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ORDERS
-- Public can insert orders (guest checkout)
CREATE POLICY "Public can insert orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Admins can view and manage all orders
CREATE POLICY "Admins can manage orders" 
ON public.orders FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- SETTINGS
-- Public can view settings (like qr_code_url, store_name)
CREATE POLICY "Public can view settings" 
ON public.settings FOR SELECT 
USING (true);

-- Admins can manage settings
CREATE POLICY "Admins can manage settings" 
ON public.settings FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- PROFILES
-- Admins can view all profiles
CREATE POLICY "Admins can view profiles" 
ON public.profiles FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Note: The first admin profile should be created directly via Supabase Dashboard / SQL, 
-- or a trigger should be used to auto-create profile on user signup.

-- 4. Initial Settings Seed
INSERT INTO public.settings (key, value) VALUES
('store_name', 'Kicchu Pet Fish'),
('pickup_address', '123 Ocean Drive, Aqua City'),
('qr_code_url', 'https://placeholder.com/qr.png')
ON CONFLICT (key) DO NOTHING;

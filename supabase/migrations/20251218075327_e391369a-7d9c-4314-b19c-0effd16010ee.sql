-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('user', 'seller', 'admin');

-- Create users table (profiles)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create waste_types table
CREATE TABLE public.waste_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 10,
  recyclable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scan_histories table
CREATE TABLE public.scan_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  waste_type_id INTEGER REFERENCES public.waste_types(id),
  image_url TEXT,
  result JSONB,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE public.locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  type TEXT,
  accepted_waste TEXT[],
  operating_hours TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  type TEXT,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for waste_types (public read)
CREATE POLICY "Anyone can view waste types" ON public.waste_types FOR SELECT USING (true);

-- RLS Policies for scan_histories
CREATE POLICY "Users can view own scans" ON public.scan_histories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.scan_histories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for products (public read, sellers can manage)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- RLS Policies for locations (public read)
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);

-- RLS Policies for rewards (public read)
CREATE POLICY "Anyone can view rewards" ON public.rewards FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample waste types
INSERT INTO public.waste_types (name, category, description, points, recyclable) VALUES
('Plastic Bottle', 'Plastic', 'PET bottles and containers', 10, true),
('Cardboard', 'Paper', 'Cardboard boxes and packaging', 8, true),
('Glass Bottle', 'Glass', 'Glass bottles and jars', 12, true),
('Aluminum Can', 'Metal', 'Aluminum cans and containers', 15, true),
('Organic Waste', 'Organic', 'Food scraps and biodegradable waste', 5, true),
('E-Waste', 'Electronic', 'Electronic devices and batteries', 20, true);

-- Insert sample locations
INSERT INTO public.locations (name, address, latitude, longitude, type, accepted_waste, operating_hours) VALUES
('Bank Sampah Induk Jakarta', 'Jl. Industri No. 10, Jakarta Utara', -6.1244, 106.8294, 'recycling_center', ARRAY['Plastic', 'Paper', 'Metal', 'Glass'], '08:00 - 17:00'),
('TPS 3R Kebayoran', 'Jl. Wijaya I No. 45, Jakarta Selatan', -6.2432, 106.7876, 'waste_bank', ARRAY['Plastic', 'Paper', 'Organic'], '07:00 - 16:00'),
('Recycling Hub Tangerang', 'Jl. BSD Raya No. 88, Tangerang Selatan', -6.2891, 106.6543, 'recycling_center', ARRAY['Plastic', 'Metal', 'E-Waste'], '09:00 - 18:00');
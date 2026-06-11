
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto profile + auto admin for the configured email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');

  IF NEW.email = 'ahmadkaimkhani40@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  diet TEXT NOT NULL DEFAULT 'nonveg',
  price_pkr INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products read" ON public.products FOR SELECT TO anon, authenticated USING (is_available = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled');
CREATE TYPE public.order_method AS ENUM ('delivery', 'pickup');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  method order_method NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  subtotal_pkr INTEGER NOT NULL,
  delivery_fee_pkr INTEGER NOT NULL DEFAULT 0,
  total_pkr INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit_price_pkr INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total_pkr INTEGER NOT NULL
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View items via own/admin order" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert items into own order" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Seed products (estimate prices)
INSERT INTO public.products (name, category, subcategory, diet, price_pkr, sort_order) VALUES
('Chicken Biryani with Raita', 'food', 'Desi & Rice', 'nonveg', 350, 1),
('Chicken Pulao Rice', 'food', 'Desi & Rice', 'nonveg', 320, 2),
('Channa Salan', 'food', 'Desi & Rice', 'veg', 180, 3),
('Channa Alo Tarkari', 'food', 'Desi & Rice', 'veg', 200, 4),
('Halwa', 'food', 'Desi & Rice', 'veg', 150, 5),
('Chapati / Roti', 'food', 'Desi & Rice', 'veg', 25, 6),
('Halwa Puri (Specialty)', 'food', 'Breakfast', 'veg', 280, 10),
('Channa Alo Breakfast', 'food', 'Breakfast', 'veg', 200, 11),
('Traditional Breakfast Platter', 'food', 'Breakfast', 'veg', 450, 12),
('Turkish Kabab', 'food', 'BBQ', 'nonveg', 400, 20),
('Chicken Tikka', 'food', 'BBQ', 'nonveg', 450, 21),
('Chicken Seekh Kabab', 'food', 'BBQ', 'nonveg', 350, 22),
('Beef Seekh Kabab', 'food', 'BBQ', 'nonveg', 380, 23),
('Mixed BBQ Platter', 'food', 'BBQ', 'nonveg', 950, 24),
('Chicken Broast', 'food', 'Fast Food', 'nonveg', 550, 30),
('Zinger Burger', 'food', 'Fast Food', 'nonveg', 450, 31),
('Chicken Sandwich', 'food', 'Fast Food', 'nonveg', 350, 32),
('Chicken Chutney Roll', 'food', 'Fast Food', 'nonveg', 220, 33),
('Chicken Cheese Roll', 'food', 'Fast Food', 'nonveg', 280, 34),
('Raita', 'food', 'Sides', 'veg', 60, 40),
('Mint Chutney', 'food', 'Sides', 'veg', 50, 41),
('Salad', 'food', 'Sides', 'veg', 80, 42),
('Pickles', 'food', 'Sides', 'veg', 50, 43),
('Strawberry Lemonade', 'beverages', 'Refreshers', 'veg', 220, 50),
('Fresh Lime', 'beverages', 'Refreshers', 'veg', 150, 51),
('Mint Margarita', 'beverages', 'Refreshers', 'veg', 200, 52),
('Cold Drink (Regular)', 'beverages', 'Soft Drinks', 'veg', 80, 60),
('Cold Drink (1.5 L)', 'beverages', 'Soft Drinks', 'veg', 220, 61),
('Mineral Water', 'beverages', 'Soft Drinks', 'veg', 60, 62),
('Doodh Patti Chai', 'beverages', 'Hot', 'veg', 100, 70),
('Karak Chai', 'beverages', 'Hot', 'veg', 120, 71),
('Green Tea', 'beverages', 'Hot', 'veg', 80, 72);

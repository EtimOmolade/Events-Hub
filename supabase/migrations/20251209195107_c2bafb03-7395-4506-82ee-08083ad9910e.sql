
-- ============================================================
-- EVENTS HUB DATABASE SCHEMA - COMPREHENSIVE MIGRATION
-- ============================================================

-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'vendor', 'user');
CREATE TYPE public.vendor_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE public.availability_status AS ENUM ('available', 'booked', 'tentative');
CREATE TYPE public.booking_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- ============ PROFILES TABLE ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ USER ROLES TABLE (SEPARATE FOR SECURITY) ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- ============ EVENT CATEGORIES ============
CREATE TABLE public.event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ VENDORS ============
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  specialty TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  status vendor_status DEFAULT 'pending',
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ EVENT SERVICES ============
CREATE TABLE public.event_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.event_categories(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(12,2) NOT NULL,
  price_type TEXT DEFAULT 'starting' CHECK (price_type IN ('fixed', 'starting', 'hourly')),
  duration TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ VENDOR PORTFOLIO ============
CREATE TABLE public.vendor_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  image_path TEXT NOT NULL,
  title TEXT,
  category TEXT,
  caption TEXT,
  event_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ AVAILABILITY ============
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status availability_status DEFAULT 'available',
  event_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(vendor_id, date)
);

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vendor_ids JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  event_date DATE,
  event_type TEXT,
  venue TEXT,
  guest_count INTEGER,
  total_price NUMERIC(12,2),
  status booking_status DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ EVENT PLANS (AI GENERATED) ============
CREATE TABLE public.event_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  raw_data JSONB DEFAULT '{}'::jsonb,
  ai_summary TEXT,
  event_type TEXT,
  theme TEXT,
  color_palette TEXT,
  guest_size TEXT,
  venue_type TEXT,
  budget TEXT,
  event_date DATE,
  packages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ MESSAGES ============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ PROMOTIONS ============
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type discount_type NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(12,2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ BANNERS ============
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_path TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============ INDEXES ============
CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_vendors_slug ON public.vendors(slug);
CREATE INDEX idx_event_services_category ON public.event_services(category_id);
CREATE INDEX idx_event_services_vendor ON public.event_services(vendor_id);
CREATE INDEX idx_availability_vendor_date ON public.availability(vendor_id, date);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_event_plans_user ON public.event_plans(user_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_vendor ON public.messages(vendor_id);

-- ============ TRIGGERS FOR UPDATED_AT ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_services_updated_at
  BEFORE UPDATE ON public.event_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_plans_updated_at
  BEFORE UPDATE ON public.event_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PROFILE AUTO-CREATE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SECURITY DEFINER FUNCTION FOR ROLE CHECKING ============
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

-- ============ HELPER FUNCTION TO CHECK VENDOR OWNERSHIP ============
CREATE OR REPLACE FUNCTION public.is_vendor_owner(_vendor_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vendors
    WHERE id = _vendor_id
      AND user_id = auth.uid()
  )
$$;

-- ============ ENABLE RLS ON ALL TABLES ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Event categories policies (public read)
CREATE POLICY "Anyone can view categories" ON public.event_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.event_categories
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Vendors policies (public read for approved)
CREATE POLICY "Anyone can view approved vendors" ON public.vendors
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can view all vendors" ON public.vendors
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage vendors" ON public.vendors
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendor owners can update own vendor" ON public.vendors
  FOR UPDATE USING (user_id = auth.uid());

-- Event services policies (public read for available)
CREATE POLICY "Anyone can view available services" ON public.event_services
  FOR SELECT USING (available = true);

CREATE POLICY "Admins can manage all services" ON public.event_services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendor owners can manage own services" ON public.event_services
  FOR ALL USING (public.is_vendor_owner(vendor_id));

-- Vendor portfolio policies (public read)
CREATE POLICY "Anyone can view portfolio" ON public.vendor_portfolio
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage portfolio" ON public.vendor_portfolio
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendor owners can manage own portfolio" ON public.vendor_portfolio
  FOR ALL USING (public.is_vendor_owner(vendor_id));

-- Availability policies (public read)
CREATE POLICY "Anyone can view availability" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage availability" ON public.availability
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendor owners can manage own availability" ON public.availability
  FOR ALL USING (public.is_vendor_owner(vendor_id));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Event plans policies
CREATE POLICY "Users can view own plans" ON public.event_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans" ON public.event_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.event_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.event_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Promotions policies (public read for active)
CREATE POLICY "Anyone can view active promotions" ON public.promotions
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage promotions" ON public.promotions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Banners policies (public read for active)
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============ ENABLE REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability;

-- ============ STORAGE BUCKET FOR VENDOR PORTFOLIO ============
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-portfolio',
  'vendor-portfolio',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies
CREATE POLICY "Anyone can view portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-portfolio');

CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vendor-portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (bucket_id = 'vendor-portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'vendor-portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

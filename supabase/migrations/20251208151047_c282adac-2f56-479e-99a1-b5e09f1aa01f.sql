-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create trigger function for new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to auto-create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create app_role enum and user_roles table
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.categories enable row level security;

create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create vendors table
create table public.vendors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text,
  bio text,
  avatar text,
  location text,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  verified boolean default false,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.vendors enable row level security;

create policy "Anyone can view active vendors"
  on public.vendors for select
  using (active = true);

create policy "Admins can manage vendors"
  on public.vendors for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create services table
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete cascade,
  description text,
  short_description text,
  price numeric(12,2) not null,
  price_type text default 'starting',
  rating numeric(2,1) default 0,
  review_count integer default 0,
  images text[] default '{}',
  features text[] default '{}',
  location text,
  available boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.services enable row level security;

create policy "Anyone can view available services"
  on public.services for select
  using (available = true);

create policy "Admins can manage services"
  on public.services for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  vendor_id uuid references public.vendors(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  event_date date not null,
  event_type text,
  guest_count integer,
  notes text,
  total_price numeric(12,2),
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Admins can view all bookings"
  on public.bookings for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update all bookings"
  on public.bookings for update
  using (public.has_role(auth.uid(), 'admin'));

-- Create event_plans table
create table public.event_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  event_type text,
  theme text,
  guest_count integer,
  budget numeric(12,2),
  event_date date,
  selected_services jsonb default '[]'::jsonb,
  selected_vendors jsonb default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.event_plans enable row level security;

create policy "Users can view their own event plans"
  on public.event_plans for select
  using (auth.uid() = user_id);

create policy "Users can create their own event plans"
  on public.event_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own event plans"
  on public.event_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own event plans"
  on public.event_plans for delete
  using (auth.uid() = user_id);

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can mark their messages as read"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Create availability table
create table public.availability (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  date date not null,
  status text default 'available' check (status in ('available', 'booked', 'tentative')),
  event_type text,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamp with time zone default now(),
  unique(vendor_id, date)
);

alter table public.availability enable row level security;

create policy "Anyone can view vendor availability"
  on public.availability for select
  to authenticated
  using (true);

create policy "Admins can manage availability"
  on public.availability for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create promotions table
create table public.promotions (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_purchase numeric(12,2),
  max_uses integer,
  uses_count integer default 0,
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.promotions enable row level security;

create policy "Anyone can view active promotions"
  on public.promotions for select
  to authenticated
  using (active = true);

create policy "Admins can manage promotions"
  on public.promotions for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create banners table
create table public.banners (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  link_text text,
  position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.banners enable row level security;

create policy "Anyone can view active banners"
  on public.banners for select
  using (active = true);

create policy "Admins can manage banners"
  on public.banners for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for vendor images
insert into storage.buckets (id, name, public)
values ('vendor-images', 'vendor-images', true)
on conflict (id) do nothing;

-- Storage policies for vendor images
create policy "Anyone can view vendor images"
on storage.objects for select
using (bucket_id = 'vendor-images');

create policy "Admins can upload vendor images"
on storage.objects for insert
with check (
  bucket_id = 'vendor-images' 
  and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can update vendor images"
on storage.objects for update
using (
  bucket_id = 'vendor-images' 
  and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can delete vendor images"
on storage.objects for delete
using (
  bucket_id = 'vendor-images' 
  and public.has_role(auth.uid(), 'admin')
);

-- Enable realtime for key tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table availability;
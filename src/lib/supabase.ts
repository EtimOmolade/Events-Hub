import { supabase } from '@/integrations/supabase/client';

// ============ Categories ============
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return { data, error };
}

// ============ Vendors ============
export async function fetchVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('active', true)
    .order('rating', { ascending: false });
  return { data, error };
}

export async function fetchVendorById(id: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return { data, error };
}

// ============ Services ============
export async function fetchServices() {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      vendor:vendors(id, name, avatar, location, rating, verified),
      category:categories(id, name, slug)
    `)
    .eq('available', true)
    .order('rating', { ascending: false });
  return { data, error };
}

export async function fetchServiceById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      vendor:vendors(id, name, avatar, location, rating, verified, bio, specialty),
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .maybeSingle();
  return { data, error };
}

export async function fetchServicesByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      vendor:vendors(id, name, avatar, location, rating, verified),
      category:categories!inner(id, name, slug)
    `)
    .eq('category.slug', categorySlug)
    .eq('available', true);
  return { data, error };
}

// ============ Bookings ============
export async function fetchUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      vendor:vendors(id, name, avatar),
      service:services(id, name, images)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createBooking(booking: {
  user_id: string;
  vendor_id?: string;
  service_id?: string;
  event_date: string;
  event_type?: string;
  guest_count?: number;
  notes?: string;
  total_price?: number;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  return { data, error };
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();
  return { data, error };
}

// ============ Event Plans ============
export async function fetchUserEventPlans(userId: string) {
  const { data, error } = await supabase
    .from('event_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createEventPlan(plan: {
  user_id: string;
  name: string;
  event_type?: string;
  theme?: string;
  guest_count?: number;
  budget?: number;
  event_date?: string;
  selected_services?: any[];
  selected_vendors?: any[];
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('event_plans')
    .insert(plan)
    .select()
    .single();
  return { data, error };
}

export async function deleteEventPlan(planId: string) {
  const { error } = await supabase
    .from('event_plans')
    .delete()
    .eq('id', planId);
  return { error };
}

// ============ Messages ============
export async function fetchUserMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      vendor:vendors(id, name, avatar)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function sendMessage(message: {
  sender_id: string;
  receiver_id?: string;
  vendor_id?: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();
  return { data, error };
}

export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)
    .select()
    .single();
  return { data, error };
}

// ============ Availability ============
export async function fetchVendorAvailability(vendorId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('date', startDate)
    .lte('date', endDate);
  return { data, error };
}

// ============ Promotions ============
export async function fetchActivePromotions() {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true);
  return { data, error };
}

export async function validatePromoCode(code: string) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .maybeSingle();
  return { data, error };
}

// ============ Banners ============
export async function fetchActiveBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .order('position');
  return { data, error };
}

// ============ Realtime Subscriptions ============
export function subscribeToMessages(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${userId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToBookings(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-bookings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

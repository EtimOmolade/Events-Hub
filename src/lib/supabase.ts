import { supabase } from '@/integrations/supabase/client';

// Re-export supabase client for convenience
export { supabase };

// ============ Event Plans ============
// Note: These functions require the 'event_plans' table to be created via migration
// The table migration is pending approval

export async function fetchUserEventPlans(userId: string) {
  // TODO: Uncomment when event_plans table is created
  // const { data, error } = await supabase
  //   .from('event_plans')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false });
  // return { data, error };
  console.warn('event_plans table not yet created');
  return { data: [], error: null };
}

export async function createEventPlan(plan: {
  user_id: string;
  name: string;
  event_type?: string;
  theme?: string;
  guest_count?: number;
  budget?: number;
  event_date?: string;
  notes?: string;
  selected_services?: any;
  selected_vendors?: any;
}) {
  // TODO: Uncomment when event_plans table is created
  // const { data, error } = await supabase
  //   .from('event_plans')
  //   .insert(plan)
  //   .select()
  //   .single();
  // return { data, error };
  console.warn('event_plans table not yet created');
  return { data: null, error: new Error('event_plans table not yet created') };
}

export async function deleteEventPlan(planId: string) {
  // TODO: Uncomment when event_plans table is created
  // const { error } = await supabase
  //   .from('event_plans')
  //   .delete()
  //   .eq('id', planId);
  // return { error };
  console.warn('event_plans table not yet created');
  return { error: new Error('event_plans table not yet created') };
}

// ============ Realtime Subscriptions ============
export function subscribeToEventPlans(userId: string, callback: (payload: any) => void) {
  // TODO: Uncomment when event_plans table is created
  // return supabase
  //   .channel('user-event-plans')
  //   .on(
  //     'postgres_changes',
  //     {
  //       event: '*',
  //       schema: 'public',
  //       table: 'event_plans',
  //       filter: `user_id=eq.${userId}`,
  //     },
  //     callback
  //   )
  //   .subscribe();
  console.warn('event_plans table not yet created');
  return null;
}
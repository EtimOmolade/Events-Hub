import { supabase } from '@/integrations/supabase/client';

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
  notes?: string;
  selected_services?: any;
  selected_vendors?: any;
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

// ============ Realtime Subscriptions ============
export function subscribeToEventPlans(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-event-plans')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'event_plans',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

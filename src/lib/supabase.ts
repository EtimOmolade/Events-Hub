import { supabase } from '@/integrations/supabase/client';

// NOTE: This file contains database query functions. 
// Many tables are not yet created in the database.
// These functions will work once the corresponding tables are created.
// For now, the app uses local data from src/data/*.ts files.

// ============ AI Plans ============
export async function fetchUserAIPlans(userId: string) {
  const { data, error } = await supabase
    .from('ai_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createAIPlan(plan: {
  user_id: string;
  raw_query: string;
  ai_summary?: string;
  event_type?: string;
  theme?: string;
  color_palette?: string;
  guest_count?: number;
  venue_type?: string;
  budget_range?: string;
  recommended_vendors?: any[];
  packages?: any[];
  timeline_tips?: any[];
}) {
  const { data, error } = await supabase
    .from('ai_plans')
    .insert(plan)
    .select()
    .single();
  return { data, error };
}

export async function deleteAIPlan(planId: string) {
  const { error } = await supabase
    .from('ai_plans')
    .delete()
    .eq('id', planId);
  return { error };
}

// ============ Realtime Subscriptions ============
export function subscribeToAIPlans(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-ai-plans')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ai_plans',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}


import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';

export const RealtimeSync = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up Realtime subscription for user:', user.id);

    // Track last update time to prevent race conditions
    let lastLocalUpdate = 0;

    const channel = supabase
      .channel('user_storage_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_storage',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime update received (storage):', payload);

          // Prevent rehydration if we just made a local update (within 2 seconds)
          const now = Date.now();
          if (now - lastLocalUpdate < 2000) {
            console.log('Skipping rehydration - recent local update detected');
            return;
          }

          console.log('Rehydrating from database');
          useStore.getState().hydrateFromDB(user.id);
        }
      )
      .subscribe();

    // Listen for local cart updates to track when we make changes
    const unsubscribe = useStore.subscribe(
      () => {
        lastLocalUpdate = Date.now();
      }
    );

    const profileChannel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Realtime update received (profile):', payload);
          // Refresh session to get latest metadata
          const { data, error } = await supabase.auth.refreshSession();
          if (data.session) {
            useStore.getState().login(data.session.user as any); // Update global store user
          }
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  return null;
};

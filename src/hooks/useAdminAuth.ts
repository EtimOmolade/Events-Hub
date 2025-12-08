import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer role check with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({ ...prev, isAdmin: false, isLoading: false }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      setAuthState(prev => ({
        ...prev,
        isAdmin: !!data,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error checking admin role:', error);
      setAuthState(prev => ({ ...prev, isAdmin: false, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Check if user has admin role
    if (data.user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        return { error: { message: 'Access denied. Admin privileges required.' } };
      }
    }

    return { data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      isAdmin: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
}

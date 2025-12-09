import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
}

// Admin emails - in production, this should come from the database
const ADMIN_EMAILS = ['admin@example.com'];

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAdmin: session?.user?.email ? ADMIN_EMAILS.includes(session.user.email) : false,
          isLoading: false,
        }));
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAdmin: session?.user?.email ? ADMIN_EMAILS.includes(session.user.email) : false,
        isLoading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Check if user is an admin
    if (data.user && !ADMIN_EMAILS.includes(data.user.email || '')) {
      await supabase.auth.signOut();
      return { error: { message: 'Access denied. Admin privileges required.' } };
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

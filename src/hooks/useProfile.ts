import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // Use auth user data directly (no profiles table in database)
    setProfile({
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      email: user.email || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      phone: user.phone || null,
      created_at: user.created_at,
      updated_at: new Date().toISOString(),
    });
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchProfile]);

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    // For now, just update local state (no profiles table)
    setProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    return { data: profile, error: null };
  };

  return {
    profile,
    isLoading,
    updateProfile,
    refetch: fetchProfile,
  };
}

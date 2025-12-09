import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create a basic profile from auth user data
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
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'Not authenticated' } };
    
    // For now, just update local state
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    return { data: profile, error: null };
  };

  return {
    profile,
    isLoading,
    updateProfile,
    refetch: () => {},
  };
}

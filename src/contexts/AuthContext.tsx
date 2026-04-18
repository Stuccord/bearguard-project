import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Agent } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  agent: Agent | null;
  loading: boolean;
  setupError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createUser: (email: string, password: string, fullName: string, role: string, phone?: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupError, setSetupError] = useState<string | null>(null);

  const fetchAgentProfile = async (userId: string) => {
    setLoading(true);
    setSetupError(null);

    const fetchTimeout = setTimeout(() => {
      console.warn('Profile fetch timed out');
      setSetupError('Profile setup timed out. Please tap Retry or contact support.');
      setLoading(false);
    }, 12000);

    try {
      // ── Attempt 1: direct lookup by id ──────────────────────────────────
      console.log('Fetching agent profile for:', userId);
      let { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // ── Attempt 2: wait 1 s and retry (trigger may not have committed yet) ─
      if (!data && !error) {
        await new Promise(r => setTimeout(r, 1000));
        ({ data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', userId)
          .maybeSingle());
      }

      if (error) {
        console.error('Error fetching agent profile:', error);
        setSetupError(`Fetch error: ${error.message}`);
      }

      if (data) {
        console.log('Profile found:', data.email);
        setAgent(data);
        return;
      }

      // ── Fallback: trigger didn't run — repair the row ─────────────────────
      console.log('Profile not found after retry, running fallback repair...');
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setSetupError(`Could not load user data: ${userError?.message ?? 'Unknown error'}`);
        return;
      }

      const u = userData.user;
      console.log('Repairing profile for:', u.email);

      // Step 1 — Re-link any orphaned agents row that has the same email
      //           but a stale/different id (previous failed signup remnant)
      const { data: relinked, error: relinkError } = await supabase
        .from('agents')
        .update({
          id:                   userId,
          full_name:            u.user_metadata?.full_name || u.email,
          phone:                u.user_metadata?.phone     || null,
          hospital_affiliation: u.user_metadata?.hospital_affiliation || '',
          is_active:            true,
        })
        .eq('email', u.email)
        .neq('id', userId)
        .select()
        .maybeSingle();

      if (relinked && !relinkError) {
        console.log('Orphaned agent row re-linked successfully');
        setAgent(relinked);
        return;
      }

      // Step 2 — No orphaned row found; create a fresh one (upsert by id is safe)
      const { data: newProfile, error: createError } = await supabase
        .from('agents')
        .upsert([{
          id:                   userId,
          email:                u.email,
          full_name:            u.user_metadata?.full_name || u.email,
          role:                 u.user_metadata?.role      || 'agent',
          phone:                u.user_metadata?.phone     || null,
          hospital_affiliation: u.user_metadata?.hospital_affiliation || '',
          is_active:            true,
        }], { onConflict: 'id' })
        .select()
        .single();

      if (createError) {
        console.error('Fallback upsert failed:', createError);
        setSetupError(`Setup failed: ${createError.message}. Please log out and try again.`);
      } else {
        console.log('Fallback profile created/repaired successfully');
        setAgent(newProfile);
      }

    } catch (err: any) {
      console.error('Unexpected error in agent profile logic:', err);
      setSetupError(`Unexpected error: ${err.message || 'Unknown error'}`);
    } finally {
      clearTimeout(fetchTimeout);
      setLoading(false);
    }
  };


  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          fetchAgentProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchAgentProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAgent(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        await fetchAgentProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const createUser = async (email: string, password: string, fullName: string, role: string, phone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: fullName,
            role: role,
            phone: phone,
            hospital_affiliation: '',
          },
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, agent, loading, setupError, signIn, signOut, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

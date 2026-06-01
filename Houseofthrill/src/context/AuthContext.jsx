import { useCallback, useEffect, useState } from "react";
import supabase from '../lib/supabase';
import {
  clearStoredAuthSnapshot,
  getStoredAuthSnapshot,
  getUserRole,
  setStoredAuthSnapshot,
  signOut as signOutUser,
} from '../lib/auth';
import { prefetchBookingPageData } from '../lib/bookingData';
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const storedAuthSnapshot = getStoredAuthSnapshot();

  const [user, setUser] = useState(() => storedAuthSnapshot.user);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(() => storedAuthSnapshot.role || null);
  const [loading, setLoading] = useState(() => !storedAuthSnapshot.user && !storedAuthSnapshot.role);

  const clearAuthState = useCallback(() => {
    clearStoredAuthSnapshot();
    setSession(null);
    setUser(null);
    setRole(null);
    setLoading(false);
  }, []);

  const syncRole = async (nextUser) => {
    if (!nextUser?.id) {
      setRole(null);
      clearStoredAuthSnapshot();
      return null;
    }

    const { role: fetchedRole } = await getUserRole(nextUser);
    const resolvedRole = fetchedRole || 'user';
    setRole(resolvedRole);
    setStoredAuthSnapshot(nextUser, resolvedRole);
    return resolvedRole;
  };

  const logout = useCallback(async () => {
    clearAuthState();
    const result = await signOutUser();
    return result;
  }, [clearAuthState]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const { data: { session: nextSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;

        setSession(nextSession);
        if (nextSession?.user) {
          setUser(nextSession.user);
          await syncRole(nextSession.user);
        } else {
          clearStoredAuthSnapshot();
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (active) {
          clearAuthState();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();
    prefetchBookingPageData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, nextSession) => {
        if (!active) return;

        if (event === 'SIGNED_OUT' || !nextSession) {
          clearAuthState();
          return;
        }

        setSession(nextSession);
        setUser(nextSession?.user || null);
        await syncRole(nextSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [clearAuthState]);

  const value = {
    user,
    session,
    role,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    logout,
    clearAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

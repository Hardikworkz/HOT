import { useCallback, useEffect, useRef, useState } from "react";
import supabase from '../lib/supabase';
import {
  clearStoredAuthSnapshot,
  getStoredAuthSnapshot,
  getUserRole,
  recoverSessionFromRedirect,
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
  // loading = true only during the initial session + role resolution on mount.
  // Once bootstrap finishes, loading is permanently false.
  const [loading, setLoading] = useState(true);

  // Track whether bootstrap has finished so onAuthStateChange doesn't
  // double-fire the role fetch and cause a stuck loading state.
  const bootstrapDone = useRef(false);

  const clearAuthState = useCallback(() => {
    clearStoredAuthSnapshot();
    setSession(null);
    setUser(null);
    setRole(null);
    setLoading(false);
  }, []);

  const syncRole = useCallback(async (nextUser) => {
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
  }, []);

  const logout = useCallback(async () => {
    clearAuthState();
    const result = await signOutUser();
    return result;
  }, [clearAuthState]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const { session: recoveredSession, error: redirectError } = await recoverSessionFromRedirect();
        if (redirectError) {
          console.error('Error recovering session from redirect:', redirectError);
        }

        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;

        const nextSession = recoveredSession || existingSession;
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
        if (active) clearAuthState();
      } finally {
        if (active) {
          bootstrapDone.current = true;
          setLoading(false);
        }
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

        // Skip events that fire before/during bootstrap — bootstrap handles them.
        // Only respond to genuine post-login events (e.g., OAuth callback).
        if (!bootstrapDone.current) return;

        setSession(nextSession);
        setUser(nextSession?.user || null);
        // Sync role silently — no loading flash, role updates in background.
        await syncRole(nextSession?.user || null);
      }
    );

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [clearAuthState, syncRole]);

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

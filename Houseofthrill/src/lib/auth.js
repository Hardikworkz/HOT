import supabase from './supabase';

const PENDING_LOGIN_ROLE_KEY = 'hot_pending_login_role';
const POST_LOGIN_DESTINATION_KEY = 'hot_post_login_destination';
const AUTH_SNAPSHOT_KEY = 'hot_auth_snapshot';
const AUTH_API_BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');
const AUTH_RECOVERY_RETRY_MS = 1500;
const AUTH_RECOVERY_MAX_ATTEMPTS = 3;

function hasWindow() {
  return typeof window !== 'undefined';
}

function readStorage(key) {
  if (!hasWindow()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  if (!hasWindow()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private browsing or locked-down environments.
  }
}

function removeStorage(key) {
  if (!hasWindow()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getUrlCallbackParams() {
  if (!hasWindow()) {
    return {
      hashParams: new URLSearchParams(),
      searchParams: new URLSearchParams(),
    };
  }

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;

  return {
    hashParams: new URLSearchParams(hash),
    searchParams: new URLSearchParams(window.location.search),
  };
}

function clearAuthRedirectParams() {
  if (!hasWindow()) return;

  const nextUrl = new URL(window.location.href);
  nextUrl.hash = '';
  nextUrl.searchParams.delete('code');
  nextUrl.searchParams.delete('state');

  window.history.replaceState({}, document.title, `${nextUrl.pathname}${nextUrl.search}`);
}

export function setStoredAuthSnapshot(user, role) {
  if (!hasWindow()) return;

  try {
    const snapshot = {
      user: user ? {
        id: user.id,
        email: user.email,
        aud: user.aud,
        created_at: user.created_at,
        updated_at: user.updated_at,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata,
      } : null,
      role: role ?? null,
    };

    window.localStorage.setItem(AUTH_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage failures in private browsing or locked-down environments.
  }
}

export function getStoredAuthSnapshot() {
  if (!hasWindow()) return { user: null, role: null };

  try {
    const raw = window.localStorage.getItem(AUTH_SNAPSHOT_KEY);
    if (!raw) return { user: null, role: null };

    return JSON.parse(raw);
  } catch {
    return { user: null, role: null };
  }
}

export function clearStoredAuthSnapshot() {
  removeStorage(AUTH_SNAPSHOT_KEY);
}

function getAuthRedirectPath(fallback) {
  if (!hasWindow()) return fallback;

  const { pathname } = window.location;
  if (pathname.startsWith('/signup')) return '/signup';
  if (pathname.startsWith('/login')) return '/login';
  return fallback;
}

export function setPendingLoginRole(role = 'user') {
  writeStorage(PENDING_LOGIN_ROLE_KEY, role);
}

export function getPendingLoginRole() {
  return readStorage(PENDING_LOGIN_ROLE_KEY) || null;
}

export function clearPendingLoginRole() {
  removeStorage(PENDING_LOGIN_ROLE_KEY);
}

export function setPostLoginDestination(destination = '/') {
  writeStorage(POST_LOGIN_DESTINATION_KEY, destination);
}

export function getPostLoginDestination() {
  return readStorage(POST_LOGIN_DESTINATION_KEY);
}

export function clearPostLoginDestination() {
  removeStorage(POST_LOGIN_DESTINATION_KEY);
}

export async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
}

export async function recoverSessionFromRedirect() {
  if (!hasWindow()) {
    return { session: null, error: null, recovered: false };
  }

  const { hashParams, searchParams } = getUrlCallbackParams();
  const hashError = hashParams.get('error_description') || hashParams.get('error');
  const code = searchParams.get('code');
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (hashError) {
    return { session: null, error: new Error(hashError), recovered: false };
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return { session: null, error, recovered: false };
    }

    clearAuthRedirectParams();
    return { session: data.session || null, error: null, recovered: true };
  }

  if (!accessToken || !refreshToken) {
    return { session: null, error: null, recovered: false };
  }

  let lastError = null;

  for (let attempt = 0; attempt < AUTH_RECOVERY_MAX_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (!error && data?.session) {
      clearAuthRedirectParams();
      return { session: data.session, error: null, recovered: true };
    }

    lastError = error || new Error('Failed to recover session from redirect');

    if (attempt < AUTH_RECOVERY_MAX_ATTEMPTS - 1) {
      await delay(AUTH_RECOVERY_RETRY_MS * (attempt + 1));
    }
  }

  return { session: null, error: lastError, recovered: false };
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error };
  }
}

async function getBackendRole() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return { profile: null, role: null, error: sessionError || null };
  }

  try {
    const response = await fetch(`${AUTH_API_BASE}/api/auth/role`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return {
        profile: null,
        role: null,
        error: new Error(payload.error || `Role lookup failed with status ${response.status}`),
      };
    }

    const payload = await response.json();

    return {
      profile: payload,
      role: payload.role || 'user',
      error: null,
    };
  } catch (error) {
    return { profile: null, role: null, error };
  }
}

export async function getUserRole(userOrId) {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;

  if (!userId) {
    return {
      profile: null,
      role: 'user',
      error: new Error('Missing user id'),
    };
  }

  const backendResult = await getBackendRole();

  if (backendResult.error) {
    console.error('Backend role lookup failed:', backendResult.error);
  }

  return {
    profile: backendResult.profile || null,
    role: backendResult.role || 'user',
    error: backendResult.error || null,
  };
}

export async function isUserAuthorizedAdmin(userOrId) {
  const { role } = await getUserRole(userOrId);
  return role === 'admin';
}

export async function updateUserRole(userId, role) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update({
        role,
      })
      .eq('user_id', userId)
      .select('user_id, email, role')
      .maybeSingle();

    if (error) throw error;

    return { success: true, profile: data, error: null };
  } catch (error) {
    console.error('Update role error:', error);
    return { success: false, profile: null, error };
  }
}

async function startOAuth(provider, requestedRole, defaultRedirect, destination) {
  if (requestedRole) {
    setPendingLoginRole(requestedRole);
  }

  if (destination) {
    setPostLoginDestination(destination);
  }

  const redirectTo = `${window.location.origin}${getAuthRedirectPath(defaultRedirect)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) throw error;
  return { success: true, data };
}

export async function signInWithGoogle(requestedRole = 'user', destination = null) {
  try {
    const fallback = destination || (requestedRole === 'admin' ? '/admin/dashboard' : '/');
    setPostLoginDestination(fallback);
    return await startOAuth('google', requestedRole, '/login', destination);
  } catch (error) {
    console.error('Google signin error:', error);
    return { success: false, error: error.message };
  }
}

export async function signInWithApple(requestedRole = 'user', destination = null) {
  try {
    const fallback = destination || (requestedRole === 'admin' ? '/admin/dashboard' : '/');
    setPostLoginDestination(fallback);
    return await startOAuth('apple', requestedRole, '/login', destination);
  } catch (error) {
    console.error('Apple signin error:', error);
    return { success: false, error: error.message };
  }
}

export async function signUpWithGoogle() {
  try {
    clearPendingLoginRole();
    setPostLoginDestination('/');
    return await startOAuth('google', 'user', '/signup');
  } catch (error) {
    console.error('Google signup error:', error);
    return { success: false, error: error.message };
  }
}

export async function signUpWithApple() {
  try {
    clearPendingLoginRole();
    setPostLoginDestination('/');
    return await startOAuth('apple', 'user', '/signup');
  } catch (error) {
    console.error('Apple signup error:', error);
    return { success: false, error: error.message };
  }
}

const SIGN_OUT_TIMEOUT_MS = 5000;

function withTimeout(promise, ms = SIGN_OUT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sign out timed out')), ms);
    }),
  ]);
}

function purgeSupabaseAuthStorage() {
  if (!hasWindow()) return;

  try {
    const keysToRemove = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('sb-') && key.includes('auth-token')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage errors.
  }
}

export async function signOut() {
  clearPendingLoginRole();
  clearPostLoginDestination();
  clearStoredAuthSnapshot();

  try {
    const { error: localError } = await withTimeout(
      supabase.auth.signOut({ scope: 'local' }),
    );
    if (localError) {
      console.warn('Local sign out warning:', localError.message);
      purgeSupabaseAuthStorage();
    }

    // Revoke server-side session in the background — must not block the UI.
    withTimeout(supabase.auth.signOut({ scope: 'global' }), 3000).catch(() => {});

    return { success: true, error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    purgeSupabaseAuthStorage();
    return { success: true, error: null };
  }
}

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback({ event, session });
  });

  return subscription;
}

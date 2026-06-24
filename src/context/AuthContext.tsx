import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthService, type AuthUser } from '../services/auth';
import { setAccessToken, setRefreshHandler, ApiError } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;          // true while restoring session on mount
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const USER_KEY = 'uni_erp_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persists user info to localStorage so the UI can show the avatar/name
  // immediately on reload while the token refresh is in-flight
  function persistUser(u: AuthUser | null) {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else    localStorage.removeItem(USER_KEY);
    setUser(u);
  }

  // Called by api.ts automatically whenever a request returns 401
  const handleRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const res = await AuthService.refresh();
      setAccessToken(res.accessToken);
      return res.accessToken;
    } catch {
      // Refresh token expired or revoked — force logout
      setAccessToken(null);
      persistUser(null);
      return null;
    }
  }, []);

  // Wire the refresh handler into the API client once on mount
  useEffect(() => {
    setRefreshHandler(handleRefresh);
  }, [handleRefresh]);

  // On mount: attempt to restore session via refresh token (HttpOnly cookie)
  useEffect(() => {
    const cachedUser = localStorage.getItem(USER_KEY);
    if (cachedUser) setUser(JSON.parse(cachedUser)); // optimistic display

   AuthService.refresh()
  .then(async (res) => {
    setAccessToken(res.accessToken);
    try {
      const me = await AuthService.getMe();
      persistUser(me.data);
    } catch {
      // refresh was valid — don't log the user out over a /me hiccup.
      // Keep the optimistically-cached user; just stop the loading spinner.
    }
  })
  .catch(() => {
    // only true refresh failures (expired/revoked token) land here
    setAccessToken(null);
    persistUser(null);
  })
  .finally(() => setIsLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────

  async function login(email: string, password: string): Promise<void> {
    const res = await AuthService.login(email, password);
    setAccessToken(res.accessToken);
    persistUser(res.user);
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  async function logout(): Promise<void> {
    try { await AuthService.logout(); } catch { /* ignore */ }
    setAccessToken(null);
    persistUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

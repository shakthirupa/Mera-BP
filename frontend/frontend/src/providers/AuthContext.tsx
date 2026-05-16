import { useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { logout as apiLogout, getProfile, tryRefreshToken } from '../services/api';
import { cancelAllReminders, scheduleAllReminders } from '../services/notifications';
import { signOutFromGoogle } from '../services/google';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../services/tokenStorage';
import type { PatientProfile } from '../types/index';

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  state:          AuthState;
  user:           PatientProfile | null;
  setUser:        (user: PatientProfile) => void;   // ← add
  signIn:         (accessToken: string, refreshToken: string, profile?: PatientProfile) => Promise<void>;
  signOut:        () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>('loading');
  const [user,  setUser]  = useState<PatientProfile | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // ── On app start — check token and load user ───────────────────────────────

  async function checkAuth(): Promise<void> {
    const timeout = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 8000)
    );
    try {
      await Promise.race([doCheckAuth(), timeout]);
    } catch {
      await clearTokens();
      setState('unauthenticated');
    }
  }

  async function doCheckAuth(): Promise<void> {
    try {
      const accessToken = await getAccessToken();

      if (accessToken) {
        try {
          // Validate token by fetching profile — if expired this throws
          const profile = await getProfile();
          setUser(profile);
          setState('authenticated');
          return;
        } catch (e){
          // Access token expired — fall through to refresh
          console.log("acess" + e)
        }
      }

      // No access token or it expired — try silent refresh
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          try {
            const profile = await getProfile();
            setUser(profile);
            setState('authenticated');
            return;
          } catch {
            // Profile fetch failed even after refresh
          }
        }
      }

      // Everything failed — user must log in
      await clearTokens();
      setState('unauthenticated');

    } catch {
      setState('unauthenticated');
    }
  }

  // ── Sign in — called from every auth screen after success ─────────────────

  const signIn = useCallback(async (
  accessToken: string,
  refreshToken: string,
  profile?: PatientProfile
): Promise<void> => {

  await saveTokens(accessToken, refreshToken);

  if (profile) {
    setUser(profile);
  } else {
    try {
      const fetched = await getProfile();
      setUser(fetched);
    } catch (e) {
      console.log("profile error", e);
    }
  }

  setState("authenticated");
  scheduleAllReminders();
  setTimeout(() => router.replace("/(app)/(tabs)/learn"), 50);
}, [router]);

  // ── Sign out — called from profile tab ────────────────────────────────────

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await apiLogout();
      await signOutFromGoogle();
      await cancelAllReminders();
    } catch {
      // ignore — account may already be deleted
    } finally {
      await clearTokens();
      setUser(null);
      setState('unauthenticated');
      router.replace('/(auth)');
    }
  }, []);

  // ── Refresh session — called when any API returns 401 ─────────────────────

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        const profile = await getProfile();
        setUser(profile);
        setState('authenticated');
        return true;
      }
      setUser(null);
      setState('unauthenticated');
      return false;
    } catch {
      setUser(null);
      setState('unauthenticated');
      return false;
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{ state, user, signIn, signOut, refreshSession, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
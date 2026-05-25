import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const ACCOUNTS_KEY = 'google_saved_accounts';

export interface SavedAccount { email: string; name: string; }
export interface GoogleCodeResult {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  clientId: string;
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_ID!;

let googleSigninModule: any = null;

async function getGoogleSignin(): Promise<any> {
  if (Platform.OS === 'web') {
    throw new Error('Native Google Sign-In is not available on web.');
  }

  if (Constants.appOwnership === 'expo') {
    throw new Error(
      'Google Sign-In is not available in Expo Go. Use email login here, or run a custom development build/APK for Google login.'
    );
  }

  if (!googleSigninModule) {
    try {
      const module = await import('@react-native-google-signin/google-signin');
      googleSigninModule = module.GoogleSignin;
      googleSigninModule.configure({ webClientId: WEB_CLIENT_ID });
    } catch {
      throw new Error(
        'Google Sign-In requires a custom development build or APK. It is not available in Expo Go.'
      );
    }
  }

  return googleSigninModule;
}

export async function getSavedAccounts(): Promise<SavedAccount[]> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveAccount(account: SavedAccount): Promise<void> {
  try {
    const existing = await getSavedAccounts();
    const updated  = [account, ...existing.filter(a => a.email !== account.email)].slice(0, 5);
    const raw      = JSON.stringify(updated);
    if (Platform.OS === 'web') { localStorage.setItem(ACCOUNTS_KEY, raw); return; }
    await SecureStore.setItemAsync(ACCOUNTS_KEY, raw);
  } catch {}
}

// ── Web: full-page redirect flow ──────────────────────────────────────────────

const webRedirectUri = 'http://localhost:8081';

export async function googleAuthRedirect(): Promise<void> {
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const request   = new AuthSession.AuthRequest({
    clientId:     WEB_CLIENT_ID,
    redirectUri:  webRedirectUri,
    scopes:       ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Code,
    usePKCE:      true,
  });

  await request.makeAuthUrlAsync(discovery);

  if (request.codeVerifier) {
    sessionStorage.setItem('google_code_verifier', request.codeVerifier);
    sessionStorage.setItem('google_redirect_uri',  webRedirectUri);
  }

  const url = await request.makeAuthUrlAsync(discovery);
  window.location.href = url;
}

export function getGoogleAuthResult(): GoogleCodeResult | null {
  if (Platform.OS !== 'web') return null;

  const params         = new URLSearchParams(window.location.search);
  const code           = params.get('code');
  const codeVerifier   = sessionStorage.getItem('google_code_verifier');
  const storedRedirect = sessionStorage.getItem('google_redirect_uri');

  if (!code || !codeVerifier) return null;

  sessionStorage.removeItem('google_code_verifier');
  sessionStorage.removeItem('google_redirect_uri');
  window.history.replaceState({}, '', window.location.pathname);

  return { code, codeVerifier, redirectUri: storedRedirect ?? webRedirectUri, clientId: WEB_CLIENT_ID };
}

// ── Native (Android APK): native Google Sign-In SDK ──────────────────────────
// Returns idToken directly — no redirect URI needed.

export async function googleAuth(): Promise<string | null> {
  const GoogleSignin = await getGoogleSignin();
  await GoogleSignin.hasPlayServices();
  try { await GoogleSignin.signOut(); } catch {}
  const userInfo = await GoogleSignin.signIn();
  console.log('[GoogleSignin] userInfo:', JSON.stringify(userInfo));
  const idToken = (userInfo as any).data?.idToken ?? (userInfo as any).idToken ?? null;
  console.log('[GoogleSignin] idToken present:', !!idToken);
  return idToken;
}

export async function signOutFromGoogle(): Promise<void> {
  if (Platform.OS !== 'web') {
    try {
      const GoogleSignin = await getGoogleSignin();
      await GoogleSignin.signOut();
    } catch {}
  }
}

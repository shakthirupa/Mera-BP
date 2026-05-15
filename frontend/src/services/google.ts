import * as AuthSession from 'expo-auth-session';
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

const WEB_CLIENT_ID     = process.env.EXPO_PUBLIC_WEB_ID!;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_ID!;

const clientId = Platform.OS === 'android' ? ANDROID_CLIENT_ID : WEB_CLIENT_ID;

export const redirectUri = Platform.OS === 'web'
  ? 'http://localhost:8081'
  : AuthSession.makeRedirectUri({ scheme: 'com.googleusercontent.apps.1010196405034-fkb5he649cfqm3j3ten5vvpmn4qnb5h5' });

// ── Web: full-page redirect flow ──────────────────────────────────────────────
// Instead of a popup (which COOP blocks), we redirect the whole page to Google,
// then on return we read the code from the URL in useGoogleAuthRedirect().

export async function googleAuthRedirect(): Promise<void> {
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const request   = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes:       ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Code,
    usePKCE:      true,
  });

  // Must call promptAsync once to generate codeVerifier
  await request.makeAuthUrlAsync(discovery);

  // Save verifier so we can use it after the redirect comes back
  if (request.codeVerifier) {
    sessionStorage.setItem('google_code_verifier', request.codeVerifier);
    sessionStorage.setItem('google_redirect_uri',  redirectUri);
  }

  const url = await request.makeAuthUrlAsync(discovery);
  window.location.href = url;
}

// Called on app load — checks if we're returning from a Google redirect
export function getGoogleAuthResult(): GoogleCodeResult | null {
  if (Platform.OS !== 'web') return null;

  const params      = new URLSearchParams(window.location.search);
  const code        = params.get('code');
  const codeVerifier = sessionStorage.getItem('google_code_verifier');
  const storedRedirect = sessionStorage.getItem('google_redirect_uri');

  if (!code || !codeVerifier) return null;

  // Clean up
  sessionStorage.removeItem('google_code_verifier');
  sessionStorage.removeItem('google_redirect_uri');

  // Clean the URL so the code isn't reused on refresh
  window.history.replaceState({}, '', window.location.pathname);

  return { code, codeVerifier, redirectUri: storedRedirect ?? redirectUri, clientId };
}

// ── Native: popup/in-app-browser flow ────────────────────────────────────────

export async function googleAuth(): Promise<GoogleCodeResult | null> {
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const nativeRedirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.googleusercontent.apps.1010196405034-fkb5he649cfqm3j3ten5vvpmn4qnb5h5',
  });
  const request   = new AuthSession.AuthRequest({
    clientId,
    redirectUri: nativeRedirectUri,
    scopes:       ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Code,
    usePKCE:      true,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') return null;

  return {
    code:         result.params.code,
    codeVerifier: request.codeVerifier!,
    redirectUri:  nativeRedirectUri,
    clientId,
  };
}

export async function signOutFromGoogle(): Promise<void> {}

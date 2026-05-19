import * as Google from 'expo-auth-session/providers/google';
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

// Web client ID used for the code flow on web
const webClientId = WEB_CLIENT_ID;

export const redirectUri = Platform.OS === 'web'
  ? 'http://localhost:8081'
  : AuthSession.makeRedirectUri({ scheme: 'com.googleusercontent.apps.1010196405034-krrn1bcf175jrklnmfplpb2l12pk8lpv' });

// ── Web: full-page redirect flow ──────────────────────────────────────────────

export async function googleAuthRedirect(): Promise<void> {
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const request   = new AuthSession.AuthRequest({
    clientId: webClientId,
    redirectUri,
    scopes:       ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Code,
    usePKCE:      true,
  });

  await request.makeAuthUrlAsync(discovery);

  if (request.codeVerifier) {
    sessionStorage.setItem('google_code_verifier', request.codeVerifier);
    sessionStorage.setItem('google_redirect_uri',  redirectUri);
  }

  const url = await request.makeAuthUrlAsync(discovery);
  window.location.href = url;
}

export function getGoogleAuthResult(): GoogleCodeResult | null {
  if (Platform.OS !== 'web') return null;

  const params       = new URLSearchParams(window.location.search);
  const code         = params.get('code');
  const codeVerifier = sessionStorage.getItem('google_code_verifier');
  const storedRedirect = sessionStorage.getItem('google_redirect_uri');

  if (!code || !codeVerifier) return null;

  sessionStorage.removeItem('google_code_verifier');
  sessionStorage.removeItem('google_redirect_uri');
  window.history.replaceState({}, '', window.location.pathname);

  return { code, codeVerifier, redirectUri: storedRedirect ?? redirectUri, clientId: webClientId };
}

// ── Native (Android APK): use expo-auth-session/providers/google ──────────────
// This uses the Android client ID with the reverse-client-ID redirect scheme,
// which is the only flow Google supports for Android OAuth clients.
// It returns an id_token directly — sent to /auth/google on the backend.

export async function googleAuth(): Promise<{ idToken: string } | null> {
  const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
  const nativeRedirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.googleusercontent.apps.1010196405034-fkb5he649cfqm3j3ten5vvpmn4qnb5h5',
  });

  const request = new AuthSession.AuthRequest({
    clientId:     ANDROID_CLIENT_ID,
    redirectUri:  nativeRedirectUri,
    scopes:       ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Token,
    extraParams:  { nonce: Math.random().toString(36).substring(2) },
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') return null;

  const idToken = result.params.id_token;
  if (!idToken) return null;

  return { idToken };
}

export async function signOutFromGoogle(): Promise<void> {}

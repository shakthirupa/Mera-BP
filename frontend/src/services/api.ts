import { API } from '../constants/api';
import type {
  AuthResponse,
  GoogleCompleteRequest,
  LoginRequest,
  PatientProfile,
} from '../types/index';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage';

// ── Base request ──────────────────────────────────────────────────────────────

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data as T;
}

// ── Authenticated request ─────────────────────────────────────────────────────

async function authRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  return request<T>(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export function loginWithEmail(body: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>(API.LOGIN_EMAIL, { method: 'POST', body: JSON.stringify(body) });
}

export function loginWithPhone(body: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>(API.LOGIN_PHONE, { method: 'POST', body: JSON.stringify(body) });
}

export function googleAuth(idToken: string): Promise<AuthResponse> {
  return request<AuthResponse>(API.GOOGLE, { method: 'POST', body: JSON.stringify({ idToken }) });
}

export function googleComplete(body: GoogleCompleteRequest): Promise<AuthResponse> {
  return request<AuthResponse>(API.GOOGLE_COMPLETE, { method: 'POST', body: JSON.stringify(body) });
}

export function forgotPassword(email: string): Promise<AuthResponse> {
  return request<AuthResponse>(API.FORGOT_PASSWORD, { method: 'POST', body: JSON.stringify({ email }) });
}

export function verifyForgotOtp(email: string, otp: string): Promise<AuthResponse> {
  return request<AuthResponse>(API.VERIFY_FORGOT_OTP, { method: 'POST', body: JSON.stringify({ email, otp }) });
}

export function resetPassword(email: string, resetToken: string, newPassword: string): Promise<AuthResponse> {
  return request<AuthResponse>(API.RESET_PASSWORD, { method: 'POST', body: JSON.stringify({ email, resetToken, newPassword }) });
}

// ── Token refresh ─────────────────────────────────────────────────────────────

export async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const data = await request<AuthResponse>(API.REFRESH, {
      method: 'POST',
      body:   JSON.stringify({ refreshToken }),
    });

    if (data.accessToken && data.refreshToken) {
      await saveTokens(data.accessToken, data.refreshToken);
      return true;
    }
    return false;
  } catch {
    await clearTokens();
    return false;
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  try {
    await authRequest<AuthResponse>(API.LOGOUT, { method: 'POST' });
  } finally {
    await clearTokens();
  }
}

// ── Patient ───────────────────────────────────────────────────────────────────

export function getProfile(): Promise<PatientProfile> {
  return authRequest<PatientProfile>(API.PROFILE, {method: 'GET'});
}

export async function deleteAccount(): Promise<void> {
  const token = await getAccessToken();
  const response = await fetch(API.DELETE_ACCOUNT, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete account.');
  }
}
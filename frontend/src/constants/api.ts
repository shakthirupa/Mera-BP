// Set EXPO_PUBLIC_API_URL in frontend/.env (dev) or EAS secrets (APK build).
// Must be reachable from other phones — not localhost or your PC's LAN IP unless they share your Wi‑Fi.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
export const API = {
  // Auth
  START_EMAIL_SIGNUP:      `${BASE_URL}/auth/start-email-signup`,
  START_PHONE_SIGNUP:      `${BASE_URL}/auth/start-phone-signup`,
  VERIFY_EMAIL_SIGNUP_OTP: `${BASE_URL}/auth/verify-email-signup-otp`,
  COMPLETE_EMAIL_SIGNUP:   `${BASE_URL}/auth/complete-email-signup`,
  COMPLETE_PHONE_SIGNUP:   `${BASE_URL}/auth/complete-phone-signup`,
  LOGIN_EMAIL:             `${BASE_URL}/auth/login/email`,
  LOGIN_PHONE:             `${BASE_URL}/auth/login/phone`,
  GOOGLE:                  `${BASE_URL}/auth/google`,
  GOOGLE_CODE:             `${BASE_URL}/auth/google/code`,
  GOOGLE_VERIFY_OTP:       `${BASE_URL}/auth/google/verify-otp`,
  GOOGLE_COMPLETE:         `${BASE_URL}/auth/google/complete`,
  REFRESH:                 `${BASE_URL}/auth/refresh`,
  LOGOUT:                  `${BASE_URL}/auth/logout`,
  CHANGE_PASSWORD:         `${BASE_URL}/auth/change-password`,
  FORGOT_PASSWORD:         `${BASE_URL}/auth/forgot-password`,
  VERIFY_FORGOT_OTP:       `${BASE_URL}/auth/verify-forgot-otp`,
  RESET_PASSWORD:          `${BASE_URL}/auth/reset-password`,
  // Patient
  PROFILE:           `${BASE_URL}/patients/profile`,
  UPDATE_PROFILE:    `${BASE_URL}/patients`,
  DELETE_ACCOUNT:    `${BASE_URL}/patients/me`,
  OBSERVATIONS:      `${BASE_URL}/observations`,
  CHAT:              `${BASE_URL}/chat`,
  MEDICATIONS:       `${BASE_URL}/medications`,
  REMINDERS:         `${BASE_URL}/reminders`,
} as const;
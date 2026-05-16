export type Gender       = 'MALE' | 'FEMALE' | 'OTHER';
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'PHONE';

export interface PatientProfile {
  name:         string;
  email:        string;
  dateOfBirth:  string;
  gender:       Gender;
  phone: string;
  authProvider: AuthProvider;
}

export interface AuthResponse {
  message:          string;
  accessToken?:     string;
  refreshToken?:    string;
  onboardingToken?: string;
  status?:          'NEEDS_ONBOARDING';
  name?:            string;
  email?:           string;
  phone?:           string;
  dateOfBirth?:     string;
  gender?:          string;
  authProvider?:    string;
}

export interface RegisterRequest {
  name:        string;
  dateOfBirth: string;
  gender:      Gender;
  email:       string;
  phone?:      string;
  password:    string;
}

export interface LoginRequest {
  email?:    string;
  password: string;
  phone?: string;
}

export interface GoogleCompleteRequest {
  onboardingToken: string;
  dateOfBirth:     string;
  gender:          Gender;
  termsAccepted:   boolean;
}
import React, { createContext, useContext, useState } from "react";

type SignupData = {
  fullName?:        string;
  email?:           string;
  phone?:           string;
  signupMethod?: "email" | "phone" | "google";
  password?:        string;
  gender?:          string;
  dob?:             string;
  otpExpiresAt?: string
  onboardingToken?: string;
};

type SignupContextType = {
  signupData:    SignupData;
  setSignupData: (data: Partial<SignupData>) => void;
  resetSignup:   () => void;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [signupData, setSignupState] = useState<SignupData>({});

  function setSignupData(data: Partial<SignupData>) {
    setSignupState((prev) => ({ ...prev, ...data }));
  }

  function resetSignup() {
    setSignupState({});
  }

  return (
    <SignupContext.Provider value={{ signupData, setSignupData, resetSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used inside SignupProvider");
  return context;
}
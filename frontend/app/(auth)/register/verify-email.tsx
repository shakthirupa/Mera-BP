import { API } from "@/src/constants/api";
import { COLORS } from "@/src/constants/theme";
import { useSignup } from "@/src/context/SignupContext";
import { useAuth } from "@/src/providers/AuthContext";
import { saveName } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 90; // 1 minute 30 seconds



export default function VerifyOtpScreen() {
  const { signupData, setSignupData } = useSignup();
  const { signIn } = useAuth();

  // Read from context — set by register screen
  const isPhone    = signupData?.signupMethod==="phone" ? true : false;
  const isGoogle   = signupData?.signupMethod==="google";
  const identifier = isPhone ? signupData?.phone : signupData?.email;

  const SEND_URL   = isPhone ? API.START_EMAIL_SIGNUP : API.START_EMAIL_SIGNUP;
  const VERIFY_URL = isPhone ? API.VERIFY_EMAIL_SIGNUP_OTP : API.VERIFY_EMAIL_SIGNUP_OTP;

  // ── State ─────────────────────────────────────────────────────────────────

const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
const [verifying, setVerifying] = useState(false);
const [resending, setResending] = useState(false);

const inputRefs = useRef<(TextInput | null)[]>([]);

const [timeLeft, setTimeLeft] = useState(0);
const [resendCooldown, setResendCooldown] = useState(0);

const isOtpComplete = otp.join("").length === OTP_LENGTH;
const isExpired = false;
const canResend = resendCooldown === 0;

// timestamps
const expiryTime = new Date((signupData.otpExpiresAt ?? "") + "Z").getTime();
const resendAvailableAt = expiryTime - (5 * 60 - RESEND_COOLDOWN) * 1000;
// explanation below

// ── Timer ─────────────────────────────────────────────────

useEffect(() => {

  const updateTimer = () => {

    const now = Date.now();

    // OTP expiry timer
    const otpRemaining = Math.max(
      Math.floor((expiryTime - now) / 1000),
      0
    );

    setTimeLeft(otpRemaining);

    // Resend cooldown timer
    const resendRemaining = Math.max(
      Math.floor((resendAvailableAt - now) / 1000),
      0
    );

    setResendCooldown(resendRemaining);

  };

  updateTimer();

  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);

}, [signupData.otpExpiresAt]);


  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // ── Focus first input on mount ────────────────────────────────────────────

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  // ── OTP input handlers ────────────────────────────────────────────────────

  function handleChange(text: string, index: number) {
    if (!/^[0-9]*$/.test(text)) return;

    // Handle paste — full OTP pasted into first box
    if (text.length === OTP_LENGTH) {
      const digits = text.split("");
      setOtp(digits);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    const digit   = text.slice(-1);
    const newOtp  = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === "Backspace") {
      if (otp[index]) {
        const newOtp  = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp      = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  }

  function clearOtp() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  // ── Verify ────────────────────────────────────────────────────────────────

  async function handleVerify() {
    if (!isOtpComplete || verifying || isExpired) return;
    Keyboard.dismiss();
    setVerifying(true);
    try {
      const code = otp.join("");

      if (isGoogle) {
        // Google OTP flow — call /auth/google/verify-otp with pending token
        const response = await fetch(API.GOOGLE_VERIFY_OTP, {
          method:  "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${signupData.onboardingToken}` },
          body:    JSON.stringify({ otp: code }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "OTP verification failed.");

        if (data.accessToken && data.refreshToken) {
          // Existing user — login complete
          if (signupData.fullName) await saveName(signupData.fullName);
          await signIn(data.accessToken, data.refreshToken);
        } else if (data.status === 'NEEDS_ONBOARDING') {
          // New user — go to onboarding
          setSignupData({ onboardingToken: data.onboardingToken });
          router.replace("/(auth)/register/onboarding");
        }
        return;
      }

      // Email / phone OTP flow
      const body = isPhone
        ? { phone: identifier, otp: code }
        : { email: identifier, otp: code };
      const response = await fetch(VERIFY_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed.");
      setSignupData({ onboardingToken: data.onboardingToken });
      router.replace("/(auth)/register/onboarding");
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message || "Something went wrong.");
      clearOtp();
    } finally {
      setVerifying(false);
    }
  }

  // ── Resend ────────────────────────────────────────────────────────────────

  async function handleResend() {
    if (!canResend || resending) return;
    setResending(true);
    try {
      if (isGoogle) {
        // Re-trigger Google auth to get a new OTP — call /auth/google with stored pending token
        // We can't re-call Google SDK here, so just inform user to restart
        Alert.alert("Resend not available", "Please go back and sign in with Google again to get a new OTP.");
        return;
      }
      const body = isPhone ? { phone: identifier } : { email: identifier };
      const response = await fetch(SEND_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed.");
      clearOtp();
      setSignupData({ otpExpiresAt: data.otpExpiresAt });
      Alert.alert("OTP Sent", `A new OTP has been sent to your ${isPhone ? "phone" : "email"}.`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
      setResendCooldown(RESEND_COOLDOWN);
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
                <ImageBackground
                    source={require("../../../assets/images/bb.png")}
                    resizeMode="cover"
                    style={styles.container}
                  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back */}
        <View style={styles.backButtonBox} >
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111" />
            </TouchableOpacity>
        </View>


        {/* Header */}
        <View style={styles.logoContainer}>
          <Text style={styles.title}>
            {isGoogle ? "Gmail Verification" : isPhone ? "Phone Verification" : "Email Verification"}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          <Text style={styles.subtitle}>
            Enter the OTP sent to your {isGoogle ? "Gmail" : isPhone ? "phone" : "email"}
          </Text>

          <Text style={styles.identifier}>{isGoogle ? signupData?.fullName ?? "Gmail" : identifier}</Text>

          {/* Timer */}
          <Text style={[styles.timer, isExpired && styles.timerExpired]}>
            {isExpired
              ? "OTP expired — please request a new one"
              : `OTP expires in ${formatTime(timeLeft)}`}
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit     && styles.otpInputFilled,
                  (isExpired || verifying) && styles.otpInputDisabled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                editable={!verifying}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isOtpComplete || verifying) && styles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete || verifying}
          >
            {verifying
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.verifyText}>Verify OTP</Text>
            }
          </TouchableOpacity>

          {/* Resend */}
            <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive it? </Text>
            {resending ? (
                <ActivityIndicator size="small" color="#2563EB" />
            ) : canResend ? (
                <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.cooldownText}>
                Resend in {Math.floor(resendCooldown / 60)}:{String(resendCooldown % 60).padStart(2, "0")}
                </Text>
            )}
            </View>
        </View>

      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
      container: {
    flex: 1,
    paddingTop: 40
  },
  scrollContent: {
    flexGrow:      1,
    padding:       20,
    paddingBottom: 80,
  },
  backButtonBox: {
    marginTop:    20,
    marginBottom: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:  0.5,
    borderColor:  "#E2E8F0",
  },
  logoContainer: {
    alignItems:   "center",
    marginBottom: 20,
    marginTop:    30,
  },
  logo: {
    width:  90,
    height: 90,
  },
  appNameContainer: {
    flexDirection: "row",
    alignItems:    "center",
  },
  appName: {
    fontSize:   32,
    fontFamily: "Poppins-Black",
    color:      "#2563EB",
  },
  bpText: {
    fontSize:   32,
    fontFamily: "Poppins-Black",
    color:      "#EF4444",
    marginLeft: 6,
  },
  tagline: {
    fontSize: 14,
    color:    "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius:    20,
    padding:         24,
    shadowColor:     "#000",
    shadowOpacity:   0.08,
    shadowRadius:    10,
    elevation:       4,
  },
  title: {
    fontSize:     20,
    fontWeight:   "700",
    color:        "#4998ff",
    marginBottom: 12,
    textAlign:    "center",
  },
  subtitle: {
    textAlign: "center",
    color:     "#64748B",
    fontSize:  14,
  },
  identifier: {
    textAlign:    "center",
    fontWeight:   "600",
    fontSize:     15,
    color:        COLORS.text,
    marginTop:    4,
    marginBottom: 6,
  },
  timer: {
    textAlign:    "center",
    color:        "#EF4444",
    fontSize:     13,
    marginBottom: 20,
  },
  timerExpired: {
    color:      "#94A3B8",
    fontWeight: "500",
  },
  otpContainer: {
    flexDirection:  "row",
    justifyContent: "space-between",
    marginBottom:   20,
  },
  otpInput: {
    width:        50,
    height:       55,
    borderWidth:  1,
    borderColor:  "#E2E8F0",
    borderRadius: 10,
    textAlign:    "center",
    fontSize:     20,
    fontWeight:   "600",
    color:        COLORS.text,
  },
  otpInputFilled: {
    borderColor:     "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  otpInputDisabled: {
    opacity: 0.4,
  },
  verifyButton: {
    backgroundColor: "#2563EB",
    borderRadius:    34,
    paddingVertical: 14,
    alignItems:      "center",
  },
  buttonDisabled: {
    opacity: 0.7
  },
  verifyText: {
    color:      "#FFFFFF",
    fontSize:   16,
    fontWeight: "600",
  },
  cooldownText: {
  color:    "#94A3B8",
  fontSize: 14,
  fontWeight: "500",
 },
  resendRow: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    marginTop:      16,
  },
  resendLabel: {
    color:    "#64748B",
    fontSize: 14,
  },
  resendLink: {
    color:      "#2563EB",
    fontWeight: "500",
    fontSize:   14,
  },
});

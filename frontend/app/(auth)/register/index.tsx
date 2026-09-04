import { API } from "@/src/constants/api";
import { COLORS } from "@/src/constants/theme";
import { useSignup } from "@/src/context/SignupContext";
import { useAuth } from "@/src/providers/AuthContext";
import { googleAuth, getGoogleAuthResult, googleAuthRedirect } from "@/src/services/google";
import { saveName } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height } = Dimensions.get('window');
const BASE_URL = API.LOGIN_EMAIL.split('/auth')[0];

interface FormErrors {
  fullName?: string;
  identifier?: string;
  password?: string;
  confirmPasssword?: string;
}

export default function RegisterScreen() {

  const { resetSignup , setSignupData } = useSignup();
  const { signIn } = useAuth();

  const [signingUp,             setSigningUp]             = useState(false);
  const [signMethod, setSignMethod] = useState<"password" | "google" | null>(null);
  const [identifier,          setIdentifier]          = useState("");
  const [usePhone,            setUsePhone]            = useState(false);
  const [password,            setPassword]            = useState("");
  const [confirmPassword,     setConfirmPassword]     = useState("");
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});


  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: FormErrors = {};

    if (usePhone) {
      if (!identifier.trim() || identifier.trim().length < 10) {
        Alert.alert("Error", "Please enter a valid phone number.");
        return false;
      }
    } else {
      if (!/\S+@\S+\.\S+/.test(identifier.trim())) {
        Alert.alert("Error", "Please enter a valid email address.");
        return false;
      }
    }

    if (!password || password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character.");
      return false;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if (!strongPassword.test(password)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter, one number, and one special character.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    
    return true;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  // Handle Google redirect return on web
  useEffect(() => {
    const result = getGoogleAuthResult();
    if (!result) return;
    setSigningUp(true);
    setSignMethod('google');
    fetch(API.GOOGLE_CODE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(result),
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(async ({ res, data }) => {
        if (!res.ok) throw new Error(data.message || 'Google signup failed');
        if (data.accessToken && data.refreshToken) {
          Alert.alert('Account Already Exists', 'You already have an account. Please login instead.', [
            { text: 'Go to Login', onPress: () => router.replace('/(auth)') }
          ]);
        } else if (data.onboardingToken) {
          resetSignup();
          setSignupData({ fullName: data.name, onboardingToken: data.onboardingToken });
          router.push('/(auth)/register/onboarding');
        }
      })
      .catch(e => Alert.alert('Google Authentication Failed', e.message))
      .finally(() => { setSigningUp(false); setSignMethod(null); });
  }, []);

  async function handleSignup() {
    if(signingUp) return;
    if (!validate()) return;

    resetSignup();
    Keyboard.dismiss();
    setSigningUp(true);
    setSignMethod("password");
    try {
      // Pick endpoint based on email or phone
      const endpoint = usePhone
        ? API.START_PHONE_SIGNUP
        : API.START_EMAIL_SIGNUP;

      const requestBody = usePhone
        ? { phone: identifier.trim() }
        : { email: identifier.trim() };

      const response = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed.");

      // Save all data to context for next screens
      setSignupData({
        email:    usePhone ? undefined : identifier.trim(),
        phone:    usePhone ? identifier.trim() : undefined,
        signupMethod:  usePhone ? "phone" : "email",
        password,
        otpExpiresAt: data.otpExpiresAt
      });

      router.push("/(auth)/register/verify-email");

    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Something went wrong.");
    } finally {
      setSigningUp(false);
      setSignMethod(null);
    }
  }

  async function handleGoogleToken(idToken: string) {
    setSigningUp(true);
    setSignMethod("google");
    resetSignup();
    try {
      const res = await fetch(API.GOOGLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google signup failed");

      if (data.accessToken && data.refreshToken) {
        // Existing user — sign in directly
        if (data.name) await saveName(data.name);
        Alert.alert('Account Already Exists', 'You already have an account. Logging you in.', [
          { text: 'OK', onPress: () => signIn(data.accessToken!, data.refreshToken!) }
        ]);
      } else if (data.status === 'NEEDS_ONBOARDING' && data.onboardingToken) {
        resetSignup();
        setSignupData({ fullName: data.name, onboardingToken: data.onboardingToken });
        router.push('/(auth)/register/onboarding');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error: any) {
      Alert.alert("Google Authentication Failed", error.message);
    } finally {
      setSigningUp(false);
      setSignMethod(null);
    }
  }

  async function handleGoogleSignup() {
    if (signingUp) return;
    setSigningUp(true);
    setSignMethod("google");
    try {
      if (Platform.OS === 'web') {
        await googleAuthRedirect();
        return;
      }
      const idToken = await googleAuth();
      if (!idToken) { setSigningUp(false); setSignMethod(null); return; }
      await handleGoogleToken(idToken);
    } catch (error: any) {
      Alert.alert("Google Authentication Failed", error.message);
    } finally {
      setSigningUp(false);
      setSignMethod(null);
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
        extraScrollHeight={40}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.appNameContainer}>
            <Text style={styles.appName}>Mera</Text>
            <Text style={styles.bpText}>BP</Text>
          </View>
          <Text style={styles.tagline}>Your Hypertension Care Partner</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          {/* Email / Phone Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, !usePhone && styles.toggleBtnActive]}
              onPress={() => { setUsePhone(false); setIdentifier(""); }}
            >
              <Text style={[styles.toggleText, !usePhone && styles.toggleTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, usePhone && styles.toggleBtnActive]}
              onPress={() => { setUsePhone(true); setIdentifier(""); }}
            >
              <Text style={[styles.toggleText, usePhone && styles.toggleTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email or Phone Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name={usePhone ? "call-outline" : "mail-outline"}
              size={20}
              color="#64748B"
            />
            <TextInput
              placeholder={usePhone ? "Phone Number" : "Email"}
              placeholderTextColor="#94a3b8"
              style={styles.input}
              keyboardType={usePhone ? "phone-pad" : "email-address"}
              autoCapitalize="none"
              autoCorrect={false}
              value={identifier}
              onChangeText={setIdentifier}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, (signingUp) && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={signingUp}
          >
            {signMethod === "password"
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signupText}>Sign Up</Text>
            }
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          {/* Google */}
        <TouchableOpacity 
          style={[styles.googleButton, (signingUp) && styles.buttonDisabled]}
          disabled={signingUp}
          onPress={handleGoogleSignup}
        >
            {signMethod === "google"
              ? <ActivityIndicator color="#111" />
              : <>
                <Image
                source={require("../../../assets/images/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
              </>
            }
        </TouchableOpacity>

        </View>

        {/* Login link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginLabel}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow:      1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems:   "center",
    marginBottom: height * 0.02,
    marginTop:    height * 0.06,
  },
  logo: {
    width:  height * 0.1,
    height: height * 0.1,
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
    color:        "#2563EB",
    marginBottom: 24,
    textAlign:    "center",
  },
  toggleContainer: {
    flexDirection: "row",
    gap:           12,
    marginBottom:  12,
  },
  toggleBtn: {
    flex:            1,
    alignItems:      "center",
    borderWidth:     1,
    borderColor:     "#E2E8F0",
    borderRadius:    12,
    paddingVertical: 10,
  },
  toggleBtnActive: {
    borderColor:     "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  toggleText: {
    fontSize: 14,
    color:    "#64748B",
  },
  toggleTextActive: {
    color:      "#2563EB",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection:     "row",
    alignItems:        "center",
    borderWidth:       0.5,
    borderColor:       "#E2E8F0",
    borderRadius:      12,
    paddingHorizontal: 12,
    paddingVertical:   6,
    marginBottom:      12,
  },
  input: {
    flex:       1,
    marginLeft: 8,
    fontSize:   15,
    color:      COLORS.text,
  },
  signupButton: {
    backgroundColor: "#2563EB",
    borderRadius:    34,
    paddingVertical: 14,
    alignItems:      "center",
    marginTop:       10,
  },
  buttonDisabled: {
    opacity: 0.7
  },
  signupText: {
    color:      "#FFFFFF",
    fontSize:   16,
    fontWeight: "600",
  },
  orText: {
    textAlign:      "center",
    color:          "#64748B",
    marginVertical: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#747775",
    borderRadius: 34,
    paddingVertical: 14,
    gap: 10,
  },
  errorText: { fontSize: 12, color: "#E05A5A", marginTop: 6 },

  googleIcon: {
    width: 20,
    height: 20,
  },

  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F1F1F"
  },
  loginContainer: {
    flexDirection:  "row",
    justifyContent: "center",
    marginTop:      20,
  },
  loginLabel: {
    fontSize: 14,
    color:    "#64748B",
  },
  loginLink: {
    fontSize:   14,
    color:      "#2563EB",
    fontWeight: "600",
  },
});

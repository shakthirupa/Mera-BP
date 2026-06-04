import { API } from "@/src/constants/api";
import { COLORS } from "@/src/constants/theme";
import { useSignup } from "@/src/context/SignupContext";
import { googleAuth, getSavedAccounts, saveAccount, googleAuthRedirect, getGoogleAuthResult, SavedAccount } from "@/src/services/google";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../src/providers/AuthContext";
import { loginWithEmail, loginWithPhone } from "../../src/services/api";
import { saveName } from "../../src/services/tokenStorage";

const { height } = Dimensions.get('window');

export default function LoginScreen() {

  const router = useRouter();
  const { signIn } = useAuth();
  const { resetSignup, setSignupData } = useSignup();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [savedAccounts, setSavedAccounts]         = useState<SavedAccount[]>([]);

  useEffect(() => {
    getSavedAccounts().then(setSavedAccounts);

    if (Platform.OS === 'web') {
      const result = getGoogleAuthResult();
      if (result) {
        setGoogleLoading(true);
        fetch(API.GOOGLE_CODE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        })
          .then((res) => res.json())
          .then(async (data) => {
            if (data.accessToken && data.refreshToken) {
              if (data.name && data.email) await saveAccount({ name: data.name, email: data.email });
              await signIn(data.accessToken, data.refreshToken);
            } else if (data.status === 'NEEDS_ONBOARDING' && data.onboardingToken) {
              resetSignup();
              setSignupData({ fullName: data.name, onboardingToken: data.onboardingToken });
              router.push('/(auth)/register/onboarding');
            }
          })
          .catch((e) => Alert.alert('Google Authentication Failed', e.message))
          .finally(() => setGoogleLoading(false));
      }
    }
  }, []);

  const isFormValid = identifier.trim().length > 0 && password.length > 0;

  async function handleLogin() {
    if (loading || googleLoading) return;

    if (!identifier.trim()) {
      Alert.alert("Error", `Please enter your ${usePhone ? "phone number" : "email"}.`);
      return;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const body = usePhone
        ? { phone: identifier.trim(), password }
        : { email: identifier.trim(), password };

      const data = usePhone 
        ? await loginWithPhone(body)
        : await loginWithEmail(body);

      if (data.accessToken && data.refreshToken) {
        if (data.name) await saveName(data.name);
        const profile = data.name ? {
          name: data.name,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          authProvider: data.authProvider,
        } as any : undefined;
        await signIn(data.accessToken, data.refreshToken, profile);
        return;
      }
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no account') || msg.toLowerCase().includes('invalid')) {
        Alert.alert('Login Failed', 'No account found with these credentials. Please sign up.', [
          { text: 'Sign Up', onPress: () => router.replace('/(auth)/register') },
          { text: 'Try Again', style: 'cancel' }
        ]);
      } else {
        Alert.alert('Login Failed', msg || 'Please check your credentials.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function proceedGoogleLogin() {
    setShowAccountPicker(false);
    setGoogleLoading(true);
    try {
      if (Platform.OS === 'web') {
        await googleAuthRedirect();
        return;
      }
      const idToken = await googleAuth();
      if (!idToken) { setGoogleLoading(false); return; }
      const res  = await fetch(API.GOOGLE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      if (data.accessToken && data.refreshToken) {
        if (data.name && data.email) await saveAccount({ name: data.name, email: data.email });
        await signIn(data.accessToken, data.refreshToken);
      } else if (data.status === 'NEEDS_ONBOARDING' && data.onboardingToken) {
        resetSignup();
        setSignupData({ fullName: data.name, onboardingToken: data.onboardingToken });
        router.push('/(auth)/register/onboarding');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error: any) {
      Alert.alert('Google Authentication Failed', `Code: ${error?.code}\n${error?.message}`);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (loading || googleLoading) return;
    if (savedAccounts.length > 0) {
      setShowAccountPicker(true);
      return;
    }
    await proceedGoogleLogin();
  }


  return (
          <ImageBackground
        source={require("../../assets/images/bb.png")}
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
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <View style={styles.appNameContainer}>
                <Text style={styles.appName}>Mera</Text>
                <Text style={styles.bpText}>BP</Text>
              </View>

              <Text style={styles.tagline}>Your Hypertension Care Partner</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Welcome Back</Text>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleBtn, !usePhone && styles.toggleBtnActive]}
                  onPress={() => {
                    setUsePhone(false);
                    setIdentifier("");
                  }}
                >
                  <Text style={[styles.toggleText, !usePhone && styles.toggleTextActive]}>
                    Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleBtn, usePhone && styles.toggleBtnActive]}
                  onPress={() => {
                    setUsePhone(true);
                    setIdentifier("");
                  }}
                >
                  <Text style={[styles.toggleText, usePhone && styles.toggleTextActive]}>
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name={usePhone ? "call-outline" : "mail-outline"}
                  size={20}
                  color="#64748B"
                />

                <TextInput
                  placeholder={usePhone ? "Phone Number" : "Email"}
                  placeholderTextColor={"#94a3b8"}
                  style={styles.input}
                  keyboardType={usePhone ? "phone-pad" : "email-address"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748B" />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor={"#94a3b8"}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={() => router.push("/(auth)/forgot-password" as any)}
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!isFormValid || loading || googleLoading) && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isFormValid || loading || googleLoading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Login</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.orText}>Or</Text>

              <TouchableOpacity 
                style={[styles.googleButton, (loading || googleLoading) && styles.buttonDisabled]}
                disabled={loading || googleLoading}
                onPress={handleGoogleLogin}
              >
                  {googleLoading
                    ? <ActivityIndicator color="#111" />
                    : <>
                      <Image
                      source={require("../../assets/images/google.png")}
                      style={styles.googleIcon}
                    />
                    <Text style={styles.googleText}>Continue with Google</Text>
                    </>
                  }
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>

              <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>

      {/* ── Account Picker Modal ───────────────────────────────────── */}
      <Modal
        visible={showAccountPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAccountPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Choose an account</Text>

                {savedAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.email}
                    style={styles.accountRow}
                    onPress={proceedGoogleLogin}
                  >
                    <View style={styles.accountAvatar}>
                      <Text style={styles.accountAvatarText}>
                        {account.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountEmail}>{account.email}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addAccountBtn} onPress={proceedGoogleLogin}>
                  <View style={styles.addAccountIcon}>
                    <Ionicons name="add" size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.addAccountText}>Use another account</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    alignItems: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.06,
  },
  logo: {
    width: height * 0.1,
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
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize:     20,
    fontWeight:   "700",
    color:        COLORS.primary,
    marginBottom: 24,
    textAlign:    "center",
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 10,
  },
  toggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  toggleText: {
    fontSize: 14,
    color: "#64748B",
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.text,
  },
  errorText: { fontSize: 12, color: "#E05A5A", marginTop: 6 },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgot: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius:    34,
    paddingVertical: 14,
    alignItems:      "center",
    marginTop:       10,
  },
  buttonDisabled: {
   opacity: 0.7
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    color: "#64748B",
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
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F1F1F"
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#64748B",
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Account picker modal
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet:         { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle:        { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle:         { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  accountRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
  accountAvatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  accountAvatarText:  { fontSize: 18, fontWeight: '700', color: '#fff' },
  accountInfo:        { flex: 1 },
  accountName:        { fontSize: 15, fontWeight: '600', color: '#111827' },
  accountEmail:       { fontSize: 13, color: '#6B7280', marginTop: 2 },
  addAccountBtn:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  addAccountIcon:     { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  addAccountText:     { fontSize: 15, fontWeight: '600', color: '#2563EB' },
});

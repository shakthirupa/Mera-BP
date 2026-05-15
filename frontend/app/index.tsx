import { API } from '@/src/constants/api';
import { COLORS } from '@/src/constants/theme';
import { useSignup } from '@/src/context/SignupContext';
import { getGoogleAuthResult, saveAccount } from '@/src/services/google';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet, Text, View,
} from 'react-native';
import ReanimatedAnimated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';
import { useAuth } from '../src/providers/AuthContext';

const Colors = { primary: '#2563eb', accent: '#06b6d4', textLight: '#64748b' };

const ReanimatedPath = ReanimatedAnimated.createAnimatedComponent(Path);
const PATH_LENGTH         = 2000;
const MIN_SPLASH_DURATION = 2000;

export default function Index() {
  const { state, signIn }              = useAuth();
  const { resetSignup, setSignupData } = useSignup();

  const googleResult = useRef(Platform.OS === 'web' ? getGoogleAuthResult() : null);
  const [googlePending, setGooglePending] = useState(!!googleResult.current);
  const [animDone, setAnimDone]           = useState(false);

  // All animated values declared unconditionally
  const heartAnim     = useRef(new Animated.Value(1)).current;
  const fadeUpText    = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dashOffset    = useSharedValue(PATH_LENGTH);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }));

  // ── Handle Google redirect return ─────────────────────────────────────────
  useEffect(() => {
    if (!googleResult.current) return;
    const result = googleResult.current;
    fetch(API.GOOGLE_CODE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(result),
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(async ({ res, data }) => {
        if (!res.ok) throw new Error(data.message || 'Google login failed');
        if (data.accessToken && data.refreshToken) {
          if (data.name && data.email) await saveAccount({ name: data.name, email: data.email });
          await signIn(data.accessToken, data.refreshToken);
        } else if (data.onboardingToken) {
          resetSignup();
          setSignupData({ fullName: data.name, onboardingToken: data.onboardingToken });
          router.replace('/(auth)/register/onboarding');
        }
      })
      .catch(() => router.replace('/(auth)'))
      .finally(() => setGooglePending(false));
  }, []);

  // ── Splash animations (skip if handling Google redirect) ──────────────────
  useEffect(() => {
    if (googlePending) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, { toValue: 1.15, duration: 150,  useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 1,    duration: 150,  useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 1.15, duration: 150,  useNativeDriver: true }),
        Animated.timing(heartAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
    Animated.timing(fadeUpText, { toValue: 1, duration: 800, delay: 500, useNativeDriver: true }).start();
    Animated.timing(progressWidth, {
      toValue: 1, duration: MIN_SPLASH_DURATION - 500, delay: 500,
      easing: Easing.ease, useNativeDriver: false,
    }).start(() => setAnimDone(true));
    dashOffset.value = withRepeat(
      withSequence(withTiming(0, { duration: 1900 }), withTiming(PATH_LENGTH, { duration: 1900 })),
      -1, false
    );
  }, [googlePending]);

  // ── Navigate when animation + auth done ───────────────────────────────────
  useEffect(() => {
    if (googlePending)       return;
    if (!animDone)           return;
    if (state === 'loading') return;
    const timer = setTimeout(() => {
      router.replace(state === 'authenticated' ? '/(app)/(tabs)/learn' : '/(auth)');
    }, 100);
    return () => clearTimeout(timer);
  }, [animDone, state, googlePending]);

  // ── While Google redirect is being processed, render nothing ─────────────
  if (googlePending) return null;

  return (
    <ImageBackground
      source={require('../assets/images/bb.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Svg width="100%" height={120} viewBox="0 0 800 200" style={styles.ecgContainer}>
        <ReanimatedPath
          animatedProps={animatedProps}
          d="M 150 100 L 200 100 L 210 15 L 230 185 L 250 50 L 270 120 L 290 90 L 300 105 L 310 100 L 330 100 L 350 0 L 370 180 L 390 30 L 410 160 L 430 80 L 450 100 L 470 10 L 490 150 L 510 60 L 530 95 L 550 12 L 570 95 L 580 130 L 590 100 L 610 100 L 630 101 L 650 100 L 700 100"
          stroke={Colors.primary}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000 2000"
        />
      </Svg>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity:   fadeUpText,
            transform: [{ translateY: fadeUpText.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          },
        ]}
      >
        <View style={styles.appNameContainer}>
          <Text style={styles.appName}>Mera</Text>
          <Text style={styles.bpText}>BP</Text>
        </View>
        <Text style={styles.tagline}>Hypertension Care & Management</Text>
      </Animated.View>

      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.loaderBar,
            { width: progressWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>

      <Text style={styles.footer}>Monitor BP • Track Health • Live Better</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', paddingHorizontal: 20, paddingTop: 190 },
  ecgContainer:     { marginTop: 60, marginBottom: 30 },
  textContainer:    { alignItems: 'center' },
  appNameContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  appName:          { fontSize: 38, fontFamily: 'Poppins-Black', color: COLORS.primary },
  bpText:           { fontSize: 38, fontFamily: 'Poppins-Black', color: '#EF4444', marginLeft: 6 },
  tagline:          { fontSize: 16, color: '#64748b', marginBottom: 50, fontWeight: '500' },
  loaderContainer:  { width: '70%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  loaderBar:        { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
  footer:           { position: 'absolute', bottom: 40, fontSize: 13, color: '#64748b', fontWeight: '500' },
});

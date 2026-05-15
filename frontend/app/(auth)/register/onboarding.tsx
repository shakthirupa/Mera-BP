import { useSignup } from "@/src/context/SignupContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    ImageBackground,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


const STEPS = ["name", "gender", "dob"];

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Others", value: "OTHER" },
];

type Gender = "MALE" | "FEMALE" | "OTHER";

interface FormData {
  fullName?: string,
  gender?: Gender;
  dob?: Date;
}

interface FormErrors {
  fullName?: string,
  gender?: string;
  dob?: string;
}

const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

// ─── Underline Input ──────────────────────────────────────────────────────────
const UnderlineInput = ({
  label,
  value,
  onChangeText,
  error,
  autoCapitalize = "words",
  returnKeyType = "next",
  onSubmitEditing,
  inputRef,
}: {
  label: string;
  value?: string;
  onChangeText: (t: string) => void;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput>;
}) => {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 160, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    if (!value)
      Animated.timing(anim, { toValue: 0, duration: 160, useNativeDriver: false }).start();
  };

  const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] });


  return (
    <View style={s.inputWrap}>
      <View style={s.inputInner}>
        <Animated.Text style={[s.inputLabel, { top: labelTop, fontSize: labelSize }]}>
          {label}
        </Animated.Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={s.textInput}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor="#111"
        />
      </View>
      <View style={[s.underline, focused && s.underlineFocused, !!error && s.underlineError]} />
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const {resetSignup, setSignupData } = useSignup();
  const { signupData } = useSignup();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({fullName: signupData.fullName, gender: undefined, dob: undefined });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPicker, setShowPicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const transition = useCallback(
    (dir: "fwd" | "back", cb: () => void) => {
      const out = dir === "fwd" ? -20 : 20;
      const inn = dir === "fwd" ? 20 : -20;
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: out, duration: 130, useNativeDriver: true }),
      ]).start(() => {
        slideAnim.setValue(inn);
        cb();
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 170, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 170, useNativeDriver: true }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim]
  );

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (step === 0) {
      if (!form.fullName || !form.fullName.trim()) e.fullName = "Required";
    }
    if (step === 1 && !form.gender) e.gender = "Please choose one";
    if (step === 2) {
      if (!form.dob) e.dob = "Required";
      else if (calculateAge(form.dob) < 13) e.dob = "Must be at least 13";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate()) return;
    if (step == STEPS.length -1 ){
        setSignupData({fullName: form.fullName, gender: form.gender, dob: form.dob!.toISOString().split("T")[0]});
        router.push("/(auth)/register/policy")
    }

    else transition("fwd", () => setStep((s) => s + 1));
  };

  const back = () => {
    if (step > 0) transition("back", () => setStep((s) => s - 1));
    else {
        resetSignup();
        router.back();
    }
  };


  const titles = ["What's your\nname?","How do you\nidentify?", "When were\nyou born?"];

  const stepBody: Record<number, React.ReactNode> = {
        0: (
      <View style={s.fields}>
        <UnderlineInput
          label="Full name"
          value={form.fullName}
          onChangeText={(t) => { setForm((f) => ({ ...f, fullName: t })); setErrors((e) => ({ ...e, fullName: undefined })); }}
          error={errors.fullName}
          returnKeyType="next"
          onSubmitEditing={next}
        />
      </View>
    ),
    1: (
      <View>
        {errors.gender ? <Text style={[s.errorText, { marginBottom: 12 }]}>{errors.gender}</Text> : null}
        <View style={s.genderList}>
          {GENDER_OPTIONS.map((opt) => {
            const active = form.gender === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => { setForm((f) => ({ ...f, gender: opt.value })); setErrors((e) => ({ ...e, gender: undefined })); }}
                style={({ pressed }) => [s.genderRow, pressed && { opacity: 0.5 }]}
              >
                <Text style={[s.genderLabel, active && s.genderLabelActive]}>{opt.label}</Text>
                <View style={[s.radio, active && s.radioActive]}>
                  {active && <View style={s.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    ),
    2: (
      <View>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={s.dobRow}
          activeOpacity={0.7}
        >
            <Ionicons name="calendar-outline" size={20} color={"#747474"}/>
          <Text style={[s.dobText, !form.dob && s.dobPlaceholder]}>
            {form.dob ? formatDate(form.dob) : "Date of Birth"}
          </Text>
        </TouchableOpacity>
        <View style={[s.underline, !!errors.dob && s.underlineError]} />
        {errors.dob ? <Text style={s.errorText}>{errors.dob}</Text> : null}
        {form.dob && !errors.dob && (
          <Text style={s.ageHint}>{calculateAge(form.dob)} years old</Text>
        )}
        {showPicker && (
          <DateTimePicker
            value={form.dob || new Date(2000, 0, 1)}
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(_, date) => {
              setShowPicker(Platform.OS === "ios");
              if (date) { setForm((f) => ({ ...f, dob: date })); setErrors((e) => ({ ...e, dob: undefined })); }
            }}
            
          />
        )}
      </View>
    ),
  };

  return (
            <ImageBackground
                source={require("../../../assets/images/bb.png")}
                resizeMode="cover"
                style={s.container}
              >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={s.topBar}>
              <TouchableOpacity onPress={back}>
                <Ionicons name="arrow-back" size={24} color={"#111"}/>
              </TouchableOpacity>
          </View>

          {/* Animated content */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
            <Text style={s.title}>{titles[step]}</Text>
            {stepBody[step]}
          </Animated.View>

          {/* CTA */}
          <View style={s.cta}>
            <TouchableOpacity onPress={next} style={s.ctaBtn} activeOpacity={0.85}>
              <Text style={s.ctaBtnText}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 40
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 60,
  },

  backText: { fontSize: 22, color: "#2563EB", lineHeight: 26 },
  stepCount: { fontSize: 12, color: "#CCC", letterSpacing: 1.5 },
  topBar: {
    marginTop:    20,
    marginBottom: 40,
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

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 40,
  },

  fields: { gap: 32 },

  inputWrap: { marginBottom: 4 },
  inputInner: { height: 52, justifyContent: "flex-end" },
  inputLabel: { position: "absolute", left: 0, fontWeight: "500", color: "#747474", letterSpacing: 0.2 },
  textInput: {
    fontSize: 16,
    color: "#111",
    paddingVertical: 6,
    padding: 0,
    fontWeight: 500,
    letterSpacing: 0.2
  },
  underline: { height: 1, backgroundColor: "#EBEBEB", marginTop: 2 },
  underlineFocused: { backgroundColor: "#111" },
  underlineError: { backgroundColor: "#E05A5A" },
  errorText: { fontSize: 12, color: "#E05A5A", marginTop: 6 },

  genderList: {},
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  genderLabel: { fontSize: 16, color: "#747474", fontWeight: "500", letterSpacing: 0.2 },
  genderLabelActive: { color: "#2563EB" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#747474",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#2563EB" },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2563EB" },

  dobRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10
  },
  dobText: { fontSize: 16, color: "#111", fontWeight: 500, letterSpacing: 0.2 },
  dobPlaceholder: { color: "#747474" },
  dobChevron: { fontSize: 22, color: "#CCC" },
  ageHint: { fontSize: 12, color: "#111", marginTop: 10, fontWeight: 500, letterSpacing: 0.2 },

  cta: { marginTop: "auto", paddingTop: 52 },
  ctaBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBtnText: { color: "#fff", fontSize: 15, fontWeight: "600", letterSpacing: 0.2 },
});

import { useEffect, useRef, useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInput as TextInputHandle } from "react-native";
import { router } from "expo-router";

import { AppleIcon, BrandHeartIcon, GoogleIcon, MailIcon, PhoneIcon } from "../../src/components/icons";
import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";

type AuthProvider = "phone" | "email";

function SocialButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.socialButton}>
      {icon}
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

export default function AuthScreen() {
  const { completeAuth } = useAppFlow();
  const [inputType, setInputType] = useState<AuthProvider>("phone");
  const [inputValue, setInputValue] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const otpRefs = useRef<Array<TextInputHandle | null>>([]);

  useEffect(() => {
    if (!showOtp || resendTimer <= 0) {
      return;
    }

    const timer = setTimeout(() => setResendTimer((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [showOtp, resendTimer]);

  function handleOtpChange(index: number, value: string) {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleBackspace(index: number) {
    if (otp[index] || index === 0) {
      return;
    }

    otpRefs.current[index - 1]?.focus();
  }

  function handleVerify() {
    if (!otp.every((digit) => digit !== "")) {
      return;
    }

    completeAuth();
    router.replace("/(onboarding)/name");
  }

  function handleResend() {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  }

  function handleSocialContinue() {
    completeAuth();
    router.replace("/(onboarding)/name");
  }

  if (showOtp) {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content}>
            <Pressable onPress={() => setShowOtp(false)} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <View style={styles.otpHeader}>
              <View style={styles.otpIconCircle}>
                {inputType === "phone" ? <PhoneIcon color="#E63946" size={30} /> : <MailIcon color="#E63946" size={30} />}
              </View>
              <Text style={styles.otpTitle}>Verify your {inputType}</Text>
              <Text style={styles.otpSubtitle}>
                We sent a 6-digit code to{"\n"}
                <Text style={styles.otpDestination}>{inputValue || (inputType === "phone" ? "+91 98765 43210" : "example@email.com")}</Text>
              </Text>
            </View>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(node) => {
                    otpRefs.current[index] = node;
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleBackspace(index);
                    }
                  }}
                  style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                  value={digit}
                />
              ))}
            </View>

            <Pressable onPress={handleVerify} disabled={!otp.every((digit) => digit !== "")} style={[styles.primaryButton, !otp.every((digit) => digit !== "") ? styles.disabledButton : null]}>
              <Text style={[styles.primaryButtonText, !otp.every((digit) => digit !== "") ? styles.disabledButtonText : null]}>Verify & Continue</Text>
            </Pressable>

            <View style={styles.resendWrap}>
              {resendTimer > 0 ? (
                <Text style={styles.resendText}>
                  Resend code in <Text style={styles.resendAccent}>{resendTimer}s</Text>
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={styles.resendButton}>Resend Code</Text>
                </Pressable>
              )}
            </View>

            <Pressable onPress={() => setShowOtp(false)} style={styles.changeMethodButton}>
              <Text style={styles.changeMethodText}>
                Wrong {inputType}? <Text style={styles.changeMethodAccent}>Change</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <BrandHeartIcon color="#FFFFFF" size={38} strokeWidth={2.5} />
            </View>
            <Text style={styles.logoTitle}>Bold Club</Text>
            <Text style={styles.logoSubtitle}>Find your meaningful connection</Text>
          </View>

          <View style={styles.toggleShell}>
            <Pressable onPress={() => setInputType("phone")} style={[styles.toggleButton, inputType === "phone" ? styles.toggleButtonActive : null]}>
              <Text style={[styles.toggleText, inputType === "phone" ? styles.toggleTextActive : null]}>Phone</Text>
            </Pressable>
            <Pressable onPress={() => setInputType("email")} style={[styles.toggleButton, inputType === "email" ? styles.toggleButtonActive : null]}>
              <Text style={[styles.toggleText, inputType === "email" ? styles.toggleTextActive : null]}>Email</Text>
            </Pressable>
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.leadingIcon}>{inputType === "phone" ? <PhoneIcon color="#6B6B6B" size={18} /> : <MailIcon color="#6B6B6B" size={18} />}</View>
            <TextInput
              autoCapitalize="none"
              keyboardType={inputType === "phone" ? "phone-pad" : "email-address"}
              onChangeText={setInputValue}
              placeholder={inputType === "phone" ? "+91 Enter phone number" : "Enter your email"}
              placeholderTextColor="#6B6B6B"
              style={styles.primaryInput}
              value={inputValue}
            />
          </View>

          <Pressable onPress={() => setShowOtp(true)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <SocialButton icon={<GoogleIcon color="#1C1C1C" size={20} strokeWidth={2.1} />} label="Google" onPress={handleSocialContinue} />
            <SocialButton icon={<AppleIcon color="#1C1C1C" size={20} strokeWidth={2.1} />} label="Apple" onPress={handleSocialContinue} />
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our <Text style={styles.legalLink}>Terms of Service</Text> and <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },
  logoWrap: { alignItems: "center", marginTop: 18 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoTitle: { marginTop: 24, fontSize: 32, fontWeight: "800", color: "#1C1C1C" },
  logoSubtitle: { marginTop: 8, fontSize: 14, color: "#6B6B6B" },
  toggleShell: { flexDirection: "row", backgroundColor: "#F5F5F5", borderRadius: 14, padding: 4, marginTop: 44 },
  toggleButton: { flex: 1, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleText: { fontSize: 14, fontWeight: "600", color: "#6B6B6B" },
  toggleTextActive: { color: "#1C1C1C" },
  inputWrap: { position: "relative", marginTop: 24 },
  leadingIcon: { position: "absolute", left: 16, top: 18, zIndex: 1 },
  primaryInput: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    paddingLeft: 46,
    paddingRight: 16,
    fontSize: 16,
    color: "#1C1C1C",
  },
  primaryButton: {
    marginTop: 24,
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  disabledButton: { backgroundColor: "#ECECEC", shadowOpacity: 0, elevation: 0 },
  disabledButtonText: { color: "#6B6B6B" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 30 },
  divider: { flex: 1, height: 1, backgroundColor: "#ECECEC" },
  dividerText: { color: "#6B6B6B", fontSize: 13 },
  socialRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  socialButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  socialText: { color: "#1C1C1C", fontSize: 15, fontWeight: "600" },
  legalText: {
    marginTop: "auto",
    paddingTop: 32,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#6B6B6B",
  },
  legalLink: { color: "#E63946" },
  backButton: { alignSelf: "flex-start", marginTop: 6, paddingVertical: 8 },
  backButtonText: { color: "#6B6B6B", fontSize: 15, fontWeight: "600" },
  otpHeader: { alignItems: "center", marginTop: 40 },
  otpIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,180,162,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpTitle: { marginTop: 24, fontSize: 28, fontWeight: "800", color: "#1C1C1C" },
  otpSubtitle: { marginTop: 10, fontSize: 14, lineHeight: 21, color: "#6B6B6B", textAlign: "center" },
  otpDestination: { color: "#1C1C1C", fontWeight: "600" },
  otpRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 36, gap: 8 },
  otpInput: {
    flex: 1,
    aspectRatio: 0.78,
    maxWidth: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ECECEC",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1C",
  },
  otpInputFilled: { borderColor: "#E63946", backgroundColor: "rgba(230,57,70,0.05)" },
  resendWrap: { marginTop: 22, alignItems: "center" },
  resendText: { color: "#6B6B6B", fontSize: 14 },
  resendAccent: { color: "#E63946", fontWeight: "700" },
  resendButton: { color: "#E63946", fontSize: 14, fontWeight: "700" },
  changeMethodButton: { marginTop: "auto", paddingTop: 28, alignItems: "center" },
  changeMethodText: { color: "#6B6B6B", fontSize: 14 },
  changeMethodAccent: { color: "#E63946", fontWeight: "700" },
});

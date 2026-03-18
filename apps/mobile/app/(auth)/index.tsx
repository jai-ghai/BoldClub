import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInput as TextInputHandle,
} from "react-native";
import { router } from "expo-router";

import { AppleIcon, BrandHeartIcon, GoogleIcon, MailIcon, PhoneIcon } from "../../src/components/icons";
import { routeForAccountStatus } from "../../src/lib/routes";
import { beginEmailAuth, beginPhoneAuth, resendEmailOtp, resendPhoneOtp, verifyEmailOtp, verifyPhoneOtp } from "../../src/services/auth";

type AuthProvider = "phone" | "email";
type OtpState = {
  destination: string;
  purpose: "signup" | "login";
  provider: AuthProvider;
};

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable disabled style={[styles.socialButton, styles.disabled]}>
      {icon}
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

export default function AuthScreen() {
  const [provider, setProvider] = useState<AuthProvider>("phone");
  const [inputValue, setInputValue] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpState, setOtpState] = useState<OtpState | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otpRefs = useRef<Array<TextInputHandle | null>>([]);

  useEffect(() => {
    if (!otpState || resendTimer <= 0) {
      return;
    }

    const timer = setTimeout(() => setResendTimer((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpState, resendTimer]);

  const otpCode = useMemo(() => otpDigits.join(""), [otpDigits]);

  async function handleBeginAuth() {
    setLoading(true);
    setError(null);

    try {
      const response =
        provider === "email" ? await beginEmailAuth(inputValue.trim().toLowerCase()) : await beginPhoneAuth(inputValue.trim());

      if (response.requires_otp && response.verification_target) {
        setOtpState({
          destination: response.verification_target,
          purpose: response.account_status === "pending_verification" ? "signup" : "login",
          provider,
        });
        setResendTimer(30);
        setOtpDigits(["", "", "", "", "", ""]);
        return;
      }

      router.replace(routeForAccountStatus(response.account_status));
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to continue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpState || otpCode.length !== 6) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        otpState.provider === "email"
          ? await verifyEmailOtp(otpState.destination, otpCode, otpState.purpose)
          : await verifyPhoneOtp(otpState.destination, otpCode, otpState.purpose);
      router.replace(routeForAccountStatus(response.account_status));
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!otpState) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (otpState.provider === "email") {
        await resendEmailOtp(otpState.destination, otpState.purpose);
      } else {
        await resendPhoneOtp(otpState.destination, otpState.purpose);
      }
      setResendTimer(30);
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to resend the code.");
    } finally {
      setLoading(false);
    }
  }

  function updateOtpDigit(index: number, value: string) {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpBackspace(index: number) {
    if (otpDigits[index] || index === 0) {
      return;
    }

    otpRefs.current[index - 1]?.focus();
  }

  const inputPlaceholder = provider === "phone" ? "+91 Enter phone number" : "Enter your email";

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {!otpState ? (
            <>
              <View style={styles.logoWrap}>
                <View style={styles.logoCircle}>
                  <BrandHeartIcon color="#FFFFFF" size={38} strokeWidth={2.5} />
                </View>
                <Text style={styles.logoTitle}>Bold Club</Text>
                <Text style={styles.logoSubtitle}>Find your meaningful connection</Text>
              </View>

              <View style={styles.toggleShell}>
                <Pressable onPress={() => setProvider("phone")} style={[styles.topToggleButton, provider === "phone" ? styles.topToggleActive : null]}>
                  <Text style={[styles.topToggleText, provider === "phone" ? styles.topToggleTextActive : null]}>Phone</Text>
                </Pressable>
                <Pressable onPress={() => setProvider("email")} style={[styles.topToggleButton, provider === "email" ? styles.topToggleActive : null]}>
                  <Text style={[styles.topToggleText, provider === "email" ? styles.topToggleTextActive : null]}>Email</Text>
                </Pressable>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.leadingIcon}>{provider === "phone" ? <PhoneIcon color="#6B6B6B" size={18} /> : <MailIcon color="#6B6B6B" size={18} />}</View>
                <TextInput
                  autoCapitalize="none"
                  keyboardType={provider === "phone" ? "phone-pad" : "email-address"}
                  onChangeText={setInputValue}
                  placeholder={inputPlaceholder}
                  placeholderTextColor="#6B6B6B"
                  style={styles.primaryInput}
                  value={inputValue}
                />
              </View>

              <Pressable disabled={loading || !inputValue.trim()} onPress={() => void handleBeginAuth()} style={[styles.primaryButton, (loading || !inputValue.trim()) ? styles.disabled : null]}>
                <Text style={styles.primaryButtonText}>{loading ? "Please wait..." : "Continue"}</Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerLabel}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialRow}>
                <SocialButton icon={<GoogleIcon color="#1C1C1C" size={20} strokeWidth={2.1} />} label="Google" />
                <SocialButton icon={<AppleIcon color="#1C1C1C" size={20} strokeWidth={2.1} />} label="Apple" />
              </View>

              <Text style={styles.legalText}>
                By continuing, you agree to our <Text style={styles.legalLink}>Terms of Service</Text> and <Text style={styles.legalLink}>Privacy Policy</Text>
              </Text>
            </>
          ) : (
            <>
              <Pressable onPress={() => setOtpState(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>

              <View style={styles.otpHeader}>
                <View style={styles.otpIconCircle}>
                  {otpState.provider === "phone" ? <PhoneIcon color="#E63946" size={30} /> : <MailIcon color="#E63946" size={30} />}
                </View>
                <Text style={styles.otpTitle}>Verify your {otpState.provider}</Text>
                <Text style={styles.otpSubtitle}>
                  We sent a 6-digit code to{"\n"}
                  <Text style={styles.otpDestination}>{otpState.destination}</Text>
                </Text>
              </View>

              <View style={styles.otpRow}>
                {otpDigits.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={(value) => updateOtpDigit(index, value)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        handleOtpBackspace(index);
                      }
                    }}
                    placeholder=""
                    style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                    value={digit}
                  />
                ))}
              </View>

              <Pressable disabled={loading || otpCode.length !== 6} onPress={() => void handleVerifyOtp()} style={[styles.primaryButton, (loading || otpCode.length !== 6) ? styles.disabled : null]}>
                <Text style={styles.primaryButtonText}>{loading ? "Verifying..." : "Verify & Continue"}</Text>
              </Pressable>

              {resendTimer > 0 ? (
                <Text style={styles.resendText}>
                  Resend code in <Text style={styles.resendAccent}>{resendTimer}s</Text>
                </Text>
              ) : (
                <Pressable onPress={() => void handleResend()}>
                  <Text style={styles.resendButton}>Resend Code</Text>
                </Pressable>
              )}

              <Text style={styles.devCodeText}>Development OTP: 123456</Text>
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 18,
  },
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
  logoTitle: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1C",
  },
  logoSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B6B6B",
  },
  toggleShell: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 4,
    marginTop: 44,
  },
  topToggleButton: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  topToggleActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B6B6B",
  },
  topToggleTextActive: {
    color: "#1C1C1C",
  },
  inputWrap: {
    position: "relative",
    marginTop: 24,
  },
  leadingIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
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
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECECEC",
  },
  dividerLabel: {
    color: "#6B6B6B",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
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
  socialText: {
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "600",
  },
  legalText: {
    marginTop: "auto",
    paddingTop: 32,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#6B6B6B",
  },
  legalLink: {
    color: "#E63946",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#6B6B6B",
    fontSize: 15,
    fontWeight: "600",
  },
  otpHeader: {
    alignItems: "center",
    marginTop: 40,
  },
  otpIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,180,162,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpTitle: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1C",
  },
  otpSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B6B6B",
    textAlign: "center",
  },
  otpDestination: {
    color: "#1C1C1C",
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
    gap: 8,
  },
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
  otpInputFilled: {
    borderColor: "#E63946",
    backgroundColor: "rgba(230,57,70,0.05)",
  },
  resendText: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 14,
    color: "#6B6B6B",
  },
  resendAccent: {
    color: "#E63946",
    fontWeight: "700",
  },
  resendButton: {
    marginTop: 22,
    textAlign: "center",
    color: "#E63946",
    fontSize: 14,
    fontWeight: "700",
  },
  devCodeText: {
    marginTop: "auto",
    paddingTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#6B6B6B",
  },
  errorText: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#C1121F",
  },
  disabled: {
    opacity: 0.55,
  },
});

import { router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { BrandAppIcon } from "../../src/components/icons";

export default function SignInScreen() {
  const [inputType, setInputType] = useState<"phone" | "email">("phone");
  const [inputValue, setInputValue] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (showOTP && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOTP, resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    setShowOTP(true);
    setResendTimer(30);
  };

  const handleVerifyOTP = () => {
    if (otp.some((digit) => digit === "")) return;
    router.replace("/(onboarding)/name");
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
  };

  const onGoogleSignIn = () => {
    router.replace("/(onboarding)/name");
  };

  const onAppleSignIn = () => {
    router.replace("/(onboarding)/name");
  };
  
  if (showOTP) {
    return (
      <View style={[styles.container, styles.bgWhite, styles.pt16, styles.px6]}>
        <Pressable 
          onPress={() => setShowOTP(false)} 
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#1C1C1C" />
        </Pressable>

        <View style={styles.headerOTP}>
          <View style={styles.iconCircleOTP}>
            {inputType === "phone" ? (
              <Phone size={32} color="#E63946" />
            ) : (
              <Mail size={32} color="#E63946" />
            )}
          </View>
          <Text style={styles.titleOTP}>Verify your {inputType}</Text>
          <Text style={styles.subtitleOTP}>
            We sent a 6-digit code to{"\n"}
            <Text style={styles.subtitleStrongOTP}>
              {inputValue || (inputType === "phone" ? "+91 98765 43210" : "example@email.com")}
            </Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleOtpChange(index, val)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : styles.otpInputEmpty
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={handleVerifyOTP}
          disabled={!otp.every(d => d !== "")}
          style={[
            styles.verifyBtn,
            otp.every(d => d !== "") ? styles.verifyBtnActive : styles.verifyBtnDisabled
          ]}
        >
          <Text style={[
            styles.verifyBtnText,
            otp.every(d => d !== "") ? styles.verifyBtnTextActive : styles.verifyBtnTextDisabled
          ]}>
            Verify & Continue
          </Text>
          <ArrowRight size={20} color={otp.every(d => d !== "") ? "#FFFFFF" : "#6B6B6B"} />
        </Pressable>

        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendText}>
              Resend code in <Text style={styles.resendTimer}>{resendTimer}s</Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text style={styles.resendAction}>Resend Code</Text>
            </Pressable>
          )}
        </View>

        <Pressable 
          onPress={() => setShowOTP(false)}
          style={styles.changeMethodBtn}
        >
          <Text style={styles.changeMethodText}>
            Wrong {inputType}? <Text style={styles.changeMethodAction}>Change</Text>
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.container, styles.bgWhite, styles.pt16, styles.px6]} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <BrandAppIcon size={88} />
          <Text style={styles.logoTitle}>Bold Club</Text>
          <Text style={styles.logoSubtitle}>Find your meaningful connection</Text>
        </View>

        {/* Input Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => {
              setInputType("phone");
              setInputValue("");
            }}
            style={[styles.toggleBtn, inputType === "phone" ? styles.toggleBtnActive : {}]}
          >
            <Text style={[styles.toggleBtnText, inputType === "phone" ? styles.toggleBtnTextActive : {}]}>
              Phone
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setInputType("email");
              setInputValue("");
            }}
            style={[styles.toggleBtn, inputType === "email" ? styles.toggleBtnActive : {}]}
          >
            <Text style={[styles.toggleBtnText, inputType === "email" ? styles.toggleBtnTextActive : {}]}>
              Email
            </Text>
          </Pressable>
        </View>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <View style={styles.inputIconPos}>
            {inputType === "phone" ? (
              <Phone size={20} color="#6B6B6B" />
            ) : (
              <Mail size={20} color="#6B6B6B" />
            )}
          </View>
          <TextInput
            keyboardType={inputType === "phone" ? "phone-pad" : "email-address"}
            placeholder={inputType === "phone" ? "+91 Enter phone number" : "Enter your email"}
            autoCapitalize="none"
            value={inputValue}
            onChangeText={setInputValue}
            placeholderTextColor="#6B6B6B"
            style={styles.inputField}
          />
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          style={styles.continueBtn}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialRow}>
          <Pressable onPress={onGoogleSignIn} style={styles.socialBtn}>
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </Svg>
            <Text style={styles.socialBtnText}>Google</Text>
          </Pressable>
          <Pressable onPress={onAppleSignIn} style={styles.socialBtn}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#1C1C1C">
              <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </Svg>
            <Text style={styles.socialBtnText}>Apple</Text>
          </Pressable>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, minHeight: "100%" },
  bgWhite: { backgroundColor: "#FFFFFF" },
  pt16: { paddingTop: 64 },
  px6: { paddingHorizontal: 24 },
  
  backButton: {
    position: "absolute",
    top: 80,
    left: 24,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    zIndex: 10,
  },

  headerOTP: { alignItems: "center", marginTop: 48 },
  iconCircleOTP: {
    width: 64, height: 64,
    backgroundColor: "rgba(255, 180, 162, 0.3)",
    borderRadius: 32,
    alignItems: "center", justifyContent: "center"
  },
  titleOTP: { fontSize: 24, fontWeight: "bold", color: "#1C1C1C", marginTop: 24 },
  subtitleOTP: { color: "#6B6B6B", fontSize: 14, marginTop: 8, textAlign: "center", lineHeight: 20 },
  subtitleStrongOTP: { color: "#1C1C1C", fontWeight: "500" },

  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 40 },
  otpInput: {
    width: 48, height: 56,
    textAlign: "center", fontSize: 20, fontWeight: "600",
    borderRadius: 12, borderWidth: 2,
  },
  otpInputFilled: { borderColor: "#E63946", backgroundColor: "rgba(230, 57, 70, 0.05)", color: "#1C1C1C" },
  otpInputEmpty: { borderColor: "#ECECEC", backgroundColor: "#F5F5F5", color: "#1C1C1C" },

  verifyBtn: {
    marginTop: 32, width: "100%", paddingVertical: 16,
    borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  verifyBtnActive: {
    backgroundColor: "#E63946",
    shadowColor: "#E63946", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5
  },
  verifyBtnDisabled: { backgroundColor: "#ECECEC" },
  verifyBtnText: { fontSize: 16, fontWeight: "600" },
  verifyBtnTextActive: { color: "#FFFFFF" },
  verifyBtnTextDisabled: { color: "#6B6B6B" },

  resendContainer: { marginTop: 24, alignItems: "center" },
  resendText: { color: "#6B6B6B", fontSize: 14 },
  resendTimer: { color: "#E63946", fontWeight: "500" },
  resendAction: { color: "#E63946", fontWeight: "500", fontSize: 14 },

  changeMethodBtn: { marginTop: "auto", marginBottom: 32, alignItems: "center" },
  changeMethodText: { fontSize: 14, color: "#6B6B6B" },
  changeMethodAction: { color: "#E63946", fontWeight: "500" },

  logoWrap: { alignItems: "center", marginTop: 32 },
  logoTitle: { fontSize: 32, fontWeight: "bold", color: "#1C1C1C", marginTop: 24 },
  logoSubtitle: { color: "#6B6B6B", fontSize: 14, marginTop: 8 },

  toggleContainer: { flexDirection: "row", backgroundColor: "#F5F5F5", borderRadius: 12, padding: 4, marginTop: 48 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  toggleBtnText: { fontSize: 14, fontWeight: "500", color: "#6B6B6B" },
  toggleBtnTextActive: { color: "#1C1C1C" },

  inputContainer: { marginTop: 24, position: "relative" },
  inputIconPos: { position: "absolute", left: 16, top: 18, zIndex: 1 },
  inputField: {
    width: "100%", paddingLeft: 48, paddingRight: 16, paddingVertical: 16,
    backgroundColor: "#F5F5F5", borderRadius: 12,
    fontSize: 16, color: "#1C1C1C",
  },

  continueBtn: {
    marginTop: 24, width: "100%", paddingVertical: 16, backgroundColor: "#E63946",
    borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#E63946", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5
  },
  continueBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#ECECEC" },
  dividerText: { color: "#6B6B6B", fontSize: 14 },

  socialRow: { flexDirection: "row", gap: 16, marginTop: 24 },
  socialBtn: {
    flex: 1, paddingVertical: 16, borderWidth: 1, borderColor: "#ECECEC", borderRadius: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12,
  },
  socialBtnText: { color: "#1C1C1C", fontSize: 16, fontWeight: "500" },

  termsText: { textAlign: "center", fontSize: 12, color: "#6B6B6B", marginTop: "auto", marginBottom: 32, paddingTop: 32 },
  termsLink: { color: "#E63946" }
});

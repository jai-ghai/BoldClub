"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react"

interface LoginScreenProps {
  onContinue: () => void
}

export function LoginScreen({ onContinue }: LoginScreenProps) {
  const [inputType, setInputType] = useState<"phone" | "email">("phone")
  const [inputValue, setInputValue] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (showOTP && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [showOTP, resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = () => {
    if (otp.every(digit => digit !== "")) {
      onContinue()
    }
  }

  const handleResend = () => {
    setResendTimer(30)
    setOtp(["", "", "", "", "", ""])
  }

  if (showOTP) {
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF] pt-16 px-6">
        {/* Back Button */}
        <button 
          onClick={() => setShowOTP(false)} 
          className="absolute top-20 left-6 p-2 rounded-full bg-[#F5F5F5]"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mt-12">
          <div className="w-16 h-16 bg-[#FFB4A2]/30 rounded-full flex items-center justify-center">
            {inputType === "phone" ? (
              <Phone className="w-8 h-8 text-[#E63946]" />
            ) : (
              <Mail className="w-8 h-8 text-[#E63946]" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] mt-6">Verify your {inputType}</h1>
          <p className="text-[#6B6B6B] text-sm mt-2 text-center">
            We sent a 6-digit code to<br />
            <span className="text-[#1C1C1C] font-medium">{inputValue || (inputType === "phone" ? "+91 98765 43210" : "example@email.com")}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mt-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 transition-all outline-none ${
                digit 
                  ? "border-[#E63946] bg-[#E63946]/5" 
                  : "border-[#ECECEC] bg-[#F5F5F5]"
              } focus:border-[#E63946] focus:bg-white`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={!otp.every(digit => digit !== "")}
          className={`mt-8 w-full py-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
            otp.every(digit => digit !== "")
              ? "bg-[#E63946] hover:bg-[#C1121F] text-white shadow-lg shadow-[#E63946]/25"
              : "bg-[#ECECEC] text-[#6B6B6B] cursor-not-allowed"
          }`}
        >
          Verify & Continue
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Resend */}
        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-[#6B6B6B] text-sm">
              Resend code in <span className="text-[#E63946] font-medium">{resendTimer}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-[#E63946] font-medium text-sm">
              Resend Code
            </button>
          )}
        </div>

        {/* Change Method */}
        <button 
          onClick={() => setShowOTP(false)}
          className="mt-auto mb-8 text-center text-sm text-[#6B6B6B]"
        >
          Wrong {inputType}? <span className="text-[#E63946] font-medium">Change</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] pt-16 px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mt-8">
        <div className="w-20 h-20 bg-[#E63946] rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#1C1C1C] mt-6">Bold Club</h1>
        <p className="text-[#6B6B6B] text-sm mt-2">Find your meaningful connection</p>
      </div>

      {/* Input Toggle */}
      <div className="flex bg-[#F5F5F5] rounded-xl p-1 mt-12">
        <button
          onClick={() => setInputType("phone")}
          className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
            inputType === "phone"
              ? "bg-white text-[#1C1C1C] shadow-sm"
              : "text-[#6B6B6B]"
          }`}
        >
          Phone
        </button>
        <button
          onClick={() => setInputType("email")}
          className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
            inputType === "email"
              ? "bg-white text-[#1C1C1C] shadow-sm"
              : "text-[#6B6B6B]"
          }`}
        >
          Email
        </button>
      </div>

      {/* Input Field */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {inputType === "phone" ? (
              <Phone className="w-5 h-5 text-[#6B6B6B]" />
            ) : (
              <Mail className="w-5 h-5 text-[#6B6B6B]" />
            )}
          </div>
          <input
            type={inputType === "phone" ? "tel" : "email"}
            placeholder={inputType === "phone" ? "+91 Enter phone number" : "Enter your email"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => setShowOTP(true)}
        className="mt-6 w-full py-4 bg-[#E63946] hover:bg-[#C1121F] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E63946]/25"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mt-8">
        <div className="flex-1 h-px bg-[#ECECEC]" />
        <span className="text-[#6B6B6B] text-sm">or continue with</span>
        <div className="flex-1 h-px bg-[#ECECEC]" />
      </div>

      {/* Social Login */}
      <div className="flex gap-4 mt-6">
        <button className="flex-1 py-4 border border-[#ECECEC] rounded-xl flex items-center justify-center gap-3 hover:bg-[#F5F5F5] transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-[#1C1C1C] font-medium">Google</span>
        </button>
        <button className="flex-1 py-4 border border-[#ECECEC] rounded-xl flex items-center justify-center gap-3 hover:bg-[#F5F5F5] transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1C1C1C">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="text-[#1C1C1C] font-medium">Apple</span>
        </button>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-[#6B6B6B] mt-auto mb-8">
        By continuing, you agree to our{" "}
        <span className="text-[#E63946]">Terms of Service</span> and{" "}
        <span className="text-[#E63946]">Privacy Policy</span>
      </p>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { ArrowRight, ArrowLeft, Camera, Check, MapPin, Sliders } from "lucide-react"
import Image from "next/image"

interface OnboardingProps {
  onComplete: (data: FormData) => void
}

interface FormData {
  firstName: string
  age: string
  gender: string
  lookingFor: string
  city: string
  heroPhoto: string
  introLine: string
  promptAnswer: string
  interests: string
  lifestyle: string
  personality: string
  location: string
  minAge: string
  maxAge: string
  radiusKm: string
  intent: string
}

const INITIAL_DATA: FormData = {
  firstName: "",
  age: "",
  gender: "",
  lookingFor: "",
  city: "",
  heroPhoto: "",
  introLine: "",
  promptAnswer: "",
  interests: "",
  lifestyle: "",
  personality: "",
  location: "",
  minAge: "25",
  maxAge: "35",
  radiusKm: "25",
  intent: "",
}

export function OnboardingScreens({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_DATA)

  const totalSteps = 12

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      onComplete(form)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const updateForm = (key: keyof FormData, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <NameStep value={form.firstName} onChange={(v) => updateForm("firstName", v)} />
      case 1:
        return <AgeStep value={form.age} onChange={(v) => updateForm("age", v)} />
      case 2:
        return <GenderStep value={form.gender} onChange={(v) => updateForm("gender", v)} />
      case 3:
        return <LookingForStep value={form.lookingFor} onChange={(v) => updateForm("lookingFor", v)} />
      case 4:
        return <CityStep value={form.city} onChange={(v) => updateForm("city", v)} />
      case 5:
        return <PhotoStep value={form.heroPhoto} onChange={(v) => updateForm("heroPhoto", v)} />
      case 6:
        return <IntroStep value={form.introLine} onChange={(v) => updateForm("introLine", v)} />
      case 7:
        return <PromptStep value={form.promptAnswer} onChange={(v) => updateForm("promptAnswer", v)} />
      case 8:
        return <InterestsStep value={form.interests} onChange={(v) => updateForm("interests", v)} />
      case 9:
        return <LifestyleStep value={form.lifestyle} onChange={(v) => updateForm("lifestyle", v)} />
      case 10:
        return <PersonalityStep value={form.personality} onChange={(v) => updateForm("personality", v)} />
      case 11:
        return (
          <PreferencesStep
            minAge={form.minAge}
            maxAge={form.maxAge}
            radiusKm={form.radiusKm}
            intent={form.intent}
            onMinAgeChange={(v) => updateForm("minAge", v)}
            onMaxAgeChange={(v) => updateForm("maxAge", v)}
            onRadiusChange={(v) => updateForm("radiusKm", v)}
            onIntentChange={(v) => updateForm("intent", v)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="pt-16 px-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevStep}
            className={`p-2 -ml-2 ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
          </button>
          <span className="text-sm text-[#6B6B6B]">{step + 1} of {totalSteps}</span>
          <div className="w-10" />
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1 bg-[#ECECEC] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E63946] transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={nextStep}
          className="w-full py-4 bg-[#E63946] hover:bg-[#C1121F] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E63946]/25"
        >
          {step === totalSteps - 1 ? "Complete" : "Continue"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Individual Step Components

function NameStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">What&apos;s your first name?</h2>
      <p className="text-[#6B6B6B] mt-2">This is how you&apos;ll appear to others</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        className="w-full mt-8 px-4 py-4 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] text-lg placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all"
      />
    </div>
  )
}

function AgeStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ages = Array.from({ length: 63 }, (_, i) => (18 + i).toString())
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">How old are you?</h2>
      <p className="text-[#6B6B6B] mt-2">Your age will be shown on your profile</p>
      <div className="grid grid-cols-5 gap-2 mt-8 max-h-[340px] overflow-y-auto pr-2">
        {ages.map((age) => (
          <button
            key={age}
            onClick={() => onChange(age)}
            className={`py-3 rounded-xl text-center font-medium transition-all ${
              value === age
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  )
}

function GenderStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">How do you identify?</h2>
      <p className="text-[#6B6B6B] mt-2">Select the option that best describes you</p>
      <div className="flex flex-col gap-3 mt-8">
        {genders.map((gender) => (
          <button
            key={gender}
            onClick={() => onChange(gender)}
            className={`w-full py-4 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              value === gender
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {gender}
            {value === gender && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function LookingForStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    "Long-term relationship",
    "Short-term relationship",
    "New friends",
    "Still figuring it out"
  ]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">What are you looking for?</h2>
      <p className="text-[#6B6B6B] mt-2">We&apos;ll match you with like-minded people</p>
      <div className="flex flex-col gap-3 mt-8">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full py-4 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              value === option
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {option}
            {value === option && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function CityStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const cities = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Where do you live?</h2>
      <p className="text-[#6B6B6B] mt-2">Find people near you</p>
      <div className="relative mt-8">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your city"
          className="w-full pl-12 pr-4 py-4 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-6">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onChange(city)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              value === city
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

function PhotoStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const samplePhotos = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
  ]

  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Add your best photo</h2>
      <p className="text-[#6B6B6B] mt-2">A clear face photo works best</p>
      
      <div className="mt-8">
        {value ? (
          <div className="relative w-48 h-64 mx-auto rounded-2xl overflow-hidden">
            <Image
              src={value}
              alt="Profile"
              fill
              className="object-cover"
            />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
            >
              <span className="text-[#1C1C1C] font-bold">&times;</span>
            </button>
          </div>
        ) : (
          <div className="w-48 h-64 mx-auto border-2 border-dashed border-[#ECECEC] rounded-2xl flex flex-col items-center justify-center gap-3 bg-[#F5F5F5]">
            <Camera className="w-10 h-10 text-[#6B6B6B]" />
            <span className="text-sm text-[#6B6B6B]">Add Photo</span>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-[#6B6B6B] mt-6 mb-3">Or choose a sample:</p>
      <div className="flex justify-center gap-3">
        {samplePhotos.map((photo, i) => (
          <button
            key={i}
            onClick={() => onChange(photo)}
            className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              value === photo ? "border-[#E63946]" : "border-transparent"
            }`}
          >
            <Image
              src={photo}
              alt={`Sample ${i + 1}`}
              width={64}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function IntroStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const suggestions = [
    "Warm, curious, and ready for something intentional.",
    "Coffee lover seeking my adventure partner.",
    "Bookworm with a love for spontaneous trips."
  ]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Write your intro</h2>
      <p className="text-[#6B6B6B] mt-2">A short line that captures your vibe</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe yourself in a line..."
        rows={3}
        className="w-full mt-8 px-4 py-4 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all resize-none"
      />
      <p className="text-sm text-[#6B6B6B] mt-4 mb-2">Need inspiration?</p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onChange(s)}
            className="text-left px-4 py-3 bg-[#FFF5F4] text-[#E63946] rounded-xl text-sm hover:bg-[#FFB4A2] hover:text-[#1C1C1C] transition-all"
          >
            &ldquo;{s}&rdquo;
          </button>
        ))}
      </div>
    </div>
  )
}

function PromptStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    "Consistency and kindness.",
    "Someone who makes me laugh.",
    "Deep conversations and honesty.",
    "Adventure and spontaneity."
  ]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">What matters most to you in a partner?</h2>
      <p className="text-[#6B6B6B] mt-2">Select or write your own</p>
      <div className="flex flex-col gap-3 mt-8">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full py-4 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              value === opt
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {opt}
            {value === opt && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
      <textarea
        value={options.includes(value) ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or write your own..."
        rows={2}
        className="w-full mt-4 px-4 py-3 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all resize-none text-sm"
      />
    </div>
  )
}

function InterestsStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const allInterests = [
    "Travel", "Books", "Pilates", "Music", "Movies", "Cooking",
    "Fitness", "Art", "Photography", "Gaming", "Hiking", "Dancing",
    "Yoga", "Coffee", "Wine", "Tech", "Fashion", "Nature"
  ]
  
  const selected = value ? value.split(", ").filter(Boolean) : []
  
  const toggleInterest = (interest: string) => {
    const lower = interest.toLowerCase()
    if (selected.includes(lower)) {
      onChange(selected.filter((s) => s !== lower).join(", "))
    } else if (selected.length < 6) {
      onChange([...selected, lower].join(", "))
    }
  }
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">What are your interests?</h2>
      <p className="text-[#6B6B6B] mt-2">Select up to 6 interests</p>
      <div className="flex flex-wrap gap-2 mt-8">
        {allInterests.map((interest) => {
          const isSelected = selected.includes(interest.toLowerCase())
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? "bg-[#E63946] text-white"
                  : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
              }`}
            >
              {interest}
            </button>
          )
        })}
      </div>
      <p className="text-sm text-[#6B6B6B] mt-6">
        Selected: {selected.length}/6
      </p>
    </div>
  )
}

function LifestyleStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const lifestyles = [
    "Early riser, mostly vegetarian, family-oriented.",
    "Night owl, non-veg, independent.",
    "Balanced routine, health-conscious.",
    "Spontaneous, social butterfly."
  ]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Describe your lifestyle</h2>
      <p className="text-[#6B6B6B] mt-2">Help others understand your daily life</p>
      <div className="flex flex-col gap-3 mt-8">
        {lifestyles.map((l) => (
          <button
            key={l}
            onClick={() => onChange(l)}
            className={`w-full py-4 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              value === l
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {l}
            {value === l && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
      <textarea
        value={lifestyles.includes(value) ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or describe in your own words..."
        rows={2}
        className="w-full mt-4 px-4 py-3 bg-[#F5F5F5] rounded-xl text-[#1C1C1C] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all resize-none text-sm"
      />
    </div>
  )
}

function PersonalityStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const personalities = [
    "Optimistic, emotionally direct, and a little playful.",
    "Introverted, thoughtful, and creative.",
    "Extroverted, adventurous, and bold.",
    "Calm, grounded, and supportive."
  ]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">How would you describe your personality?</h2>
      <p className="text-[#6B6B6B] mt-2">Let your true self shine</p>
      <div className="flex flex-col gap-3 mt-8">
        {personalities.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-full py-4 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              value === p
                ? "bg-[#E63946] text-white"
                : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
            }`}
          >
            {p}
            {value === p && <Check className="w-5 h-5" />}
          </button>
        ))}
      </div>
    </div>
  )
}

interface PreferencesStepProps {
  minAge: string
  maxAge: string
  radiusKm: string
  intent: string
  onMinAgeChange: (v: string) => void
  onMaxAgeChange: (v: string) => void
  onRadiusChange: (v: string) => void
  onIntentChange: (v: string) => void
}

function PreferencesStep({
  minAge,
  maxAge,
  radiusKm,
  intent,
  onMinAgeChange,
  onMaxAgeChange,
  onRadiusChange,
  onIntentChange,
}: PreferencesStepProps) {
  const intents = ["Serious dating", "Casual dating", "Open to anything"]
  
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Set your preferences</h2>
      <p className="text-[#6B6B6B] mt-2">Find your ideal match</p>
      
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-5 h-5 text-[#E63946]" />
          <span className="font-medium text-[#1C1C1C]">Age Range</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="18"
            max="80"
            value={minAge}
            onChange={(e) => onMinAgeChange(e.target.value)}
            className="w-20 px-3 py-2 bg-[#F5F5F5] rounded-lg text-center text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
          <span className="text-[#6B6B6B]">to</span>
          <input
            type="number"
            min="18"
            max="80"
            value={maxAge}
            onChange={(e) => onMaxAgeChange(e.target.value)}
            className="w-20 px-3 py-2 bg-[#F5F5F5] rounded-lg text-center text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
          <span className="text-[#6B6B6B]">years</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#E63946]" />
          <span className="font-medium text-[#1C1C1C]">Distance</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="100"
            value={radiusKm}
            onChange={(e) => onRadiusChange(e.target.value)}
            className="flex-1 h-2 bg-[#ECECEC] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#E63946] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="w-16 text-right text-[#1C1C1C] font-medium">{radiusKm} km</span>
        </div>
      </div>
      
      <div className="mt-6">
        <span className="font-medium text-[#1C1C1C] block mb-3">Dating Intent</span>
        <div className="flex flex-col gap-2">
          {intents.map((i) => (
            <button
              key={i}
              onClick={() => onIntentChange(i)}
              className={`w-full py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
                intent === i
                  ? "bg-[#E63946] text-white"
                  : "bg-[#F5F5F5] text-[#1C1C1C] hover:bg-[#FFB4A2]"
              }`}
            >
              {i}
              {intent === i && <Check className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

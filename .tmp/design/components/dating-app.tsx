"use client"

import { useState } from "react"
import { IPhoneFrame } from "./iphone-frame"
import { LoginScreen } from "./screens/login-screen"
import { OnboardingScreens } from "./screens/onboarding-screens"
import { BottomTabs } from "./bottom-tabs"
import { DiscoverScreen, LikesScreen, ChatScreen, ProfileScreen, PersonalityScreen } from "./screens/main-screens"

type AppState = "login" | "onboarding" | "main"

type TabType = "personality" | "likes" | "discover" | "chat" | "profile"

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

export function DatingApp() {
  const [appState, setAppState] = useState<AppState>("login")
  const [activeTab, setActiveTab] = useState<TabType>("discover")
  
  const [userProfile, setUserProfile] = useState<FormData>({
    firstName: "",
    age: "",
    gender: "",
    lookingFor: "",
    city: "",
    heroPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    introLine: "",
    promptAnswer: "",
    interests: "",
    lifestyle: "",
    personality: "",
    location: "",
    minAge: "26",
    maxAge: "34",
    radiusKm: "25",
    intent: "",
  })

  const handleOnboardingComplete = (data: FormData) => {
    setUserProfile(data)
    setAppState("main")
  }

  const renderScreen = () => {
    switch (appState) {
      case "login":
        return <LoginScreen onContinue={() => setAppState("onboarding")} />
      
      case "onboarding":
        return <OnboardingScreens onComplete={handleOnboardingComplete} />
      
      case "main":
        return (
          <div className="relative h-full">
            {activeTab === "discover" && <DiscoverScreen userProfile={userProfile} />}
            {activeTab === "likes" && <LikesScreen />}
            {activeTab === "chat" && <ChatScreen />}
            {activeTab === "profile" && <ProfileScreen userProfile={userProfile} />}
            {activeTab === "personality" && <PersonalityScreen userProfile={userProfile} />}
            <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        )
      
      default:
        return <LoginScreen onContinue={() => setAppState("onboarding")} />
    }
  }

  return (
    <IPhoneFrame>
      {renderScreen()}
    </IPhoneFrame>
  )
}

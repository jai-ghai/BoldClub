"use client"

import { Heart, MessageCircle, Compass, User, Sparkles } from "lucide-react"

type TabType = "personality" | "likes" | "discover" | "chat" | "profile"

interface BottomTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  const tabs = [
    { id: "personality" as TabType, icon: Sparkles, label: "Personality" },
    { id: "likes" as TabType, icon: Heart, label: "Likes" },
    { id: "discover" as TabType, icon: Compass, label: "Discover" },
    { id: "chat" as TabType, icon: MessageCircle, label: "Chat" },
    { id: "profile" as TabType, icon: User, label: "Profile" },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-[#ECECEC] px-2 py-2 pb-6">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-[#E63946]" : "text-[#6B6B6B]"
                }`}
                fill={isActive ? "#E63946" : "none"}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#E63946]" : "text-[#6B6B6B]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

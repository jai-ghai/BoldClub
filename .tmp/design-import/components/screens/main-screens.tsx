"use client"

import { useState, useRef } from "react"
import { 
  Heart, X, Star, MapPin, Briefcase, ChevronLeft, ChevronRight, Send, Settings, 
  Edit3, Camera, Check, Sparkles, BookOpen, Coffee, Music, Dumbbell, Plane, 
  Gift, Quote, SlidersHorizontal, Crown, Zap, Shield, MessageCircle, Search,
  Clock, Brain, Flower2, ChevronDown, ChevronUp, Users, Eye, Package
} from "lucide-react"
import Image from "next/image"

interface UserProfile {
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

// Discover Screen with Filters, Swipe, Full Profile View, and Match Animation
export function DiscoverScreen({ userProfile }: { userProfile: UserProfile }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showFullProfile, setShowFullProfile] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const profiles = [
    {
      name: "Priya",
      age: 26,
      location: "Bengaluru",
      bio: "Designer by day, stargazer by night",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      distance: "3 km away",
      verified: true,
      job: "UX Designer at Google",
      interests: ["Travel", "Art", "Yoga", "Photography"],
      lifestyle: "Early bird, loves hiking on weekends",
      personality: "Creative, empathetic, and spontaneous",
      promptAnswer: "Someone who makes me laugh even on bad days",
    },
    {
      name: "Neha",
      age: 28,
      location: "Bengaluru",
      bio: "Coffee enthusiast and book lover",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      distance: "5 km away",
      verified: true,
      job: "Product Manager at Flipkart",
      interests: ["Books", "Coffee", "Music", "Cooking"],
      lifestyle: "Night owl, weekend chef",
      personality: "Thoughtful, ambitious, and caring",
      promptAnswer: "Deep conversations and comfortable silences",
    },
    {
      name: "Ananya",
      age: 25,
      location: "Bengaluru",
      bio: "Finding magic in everyday moments",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      distance: "8 km away",
      verified: false,
      job: "Content Writer",
      interests: ["Writing", "Movies", "Dance", "Food"],
      lifestyle: "Balanced life enthusiast",
      personality: "Curious, warm, and optimistic",
      promptAnswer: "Kindness and a good sense of humor",
    },
  ]

  const currentProfile = profiles[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    setTimeout(() => {
      if (direction === "right" && Math.random() > 0.5) {
        setShowMatch(true)
      } else {
        setCurrentIndex((prev) => (prev + 1) % profiles.length)
      }
      setSwipeDirection(null)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSwipe("left")
      } else {
        handleSwipe("right")
      }
    }
    setTouchStart(null)
  }

  // Match Animation Screen
  if (showMatch) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#E63946] to-[#C1121F] items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image src={userProfile.heroPhoto} alt="You" fill className="object-cover" />
            </div>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl -ml-6">
              <Image src={currentProfile.image} alt={currentProfile.name} fill className="object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
            <Heart className="w-6 h-6 text-[#E63946] fill-[#E63946]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">It&apos;s a Match!</h1>
        <p className="text-white/80 text-center mb-8">
          You and {currentProfile.name} liked each other
        </p>

        <div className="w-full space-y-3">
          <button 
            onClick={() => setShowMatch(false)}
            className="w-full py-4 bg-white text-[#E63946] font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Send a Message
          </button>
          <button 
            onClick={() => {
              setShowMatch(false)
              setCurrentIndex((prev) => (prev + 1) % profiles.length)
            }}
            className="w-full py-4 bg-white/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Lowkey - Check Compatibility First
          </button>
        </div>
      </div>
    )
  }

  // Full Profile View
  if (showFullProfile) {
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 pt-3 pb-2 flex items-center gap-3 z-10">
          <button onClick={() => setShowFullProfile(false)} className="p-2 rounded-full bg-[#F5F5F5]">
            <ChevronLeft className="w-5 h-5 text-[#1C1C1C]" />
          </button>
          <h1 className="text-lg font-semibold text-[#1C1C1C]">{currentProfile.name}&apos;s Profile</h1>
        </div>

        {/* Photo */}
        <div className="relative w-full aspect-[3/4]">
          <Image src={currentProfile.image} alt={currentProfile.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{currentProfile.name}, {currentProfile.age}</h2>
              {currentProfile.verified && (
                <div className="bg-[#E63946] rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">{currentProfile.distance}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-4 py-4 space-y-4 pb-32">
          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <p className="text-[#1C1C1C]">{currentProfile.bio}</p>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#6B6B6B]" />
            <span className="text-[#1C1C1C] text-sm">{currentProfile.job}</span>
          </div>

          <div>
            <h3 className="font-semibold text-[#1C1C1C] mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-[#FFB4A2]/30 text-[#C1121F] rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <p className="text-sm text-[#6B6B6B] mb-1">Lifestyle</p>
            <p className="text-[#1C1C1C]">{currentProfile.lifestyle}</p>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <p className="text-sm text-[#6B6B6B] mb-1">Personality</p>
            <p className="text-[#1C1C1C]">{currentProfile.personality}</p>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <p className="text-sm text-[#6B6B6B] mb-1">What matters most in a partner?</p>
            <div className="flex items-start gap-2 mt-2">
              <Quote className="w-4 h-4 text-[#E63946] flex-shrink-0 mt-0.5" />
              <p className="text-[#1C1C1C] italic">{currentProfile.promptAnswer}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center gap-4 px-6 py-4 bg-white/90 backdrop-blur-sm">
          <button 
            onClick={() => { setShowFullProfile(false); handleSwipe("left"); }}
            className="w-14 h-14 rounded-full bg-white shadow-lg border border-[#ECECEC] flex items-center justify-center"
          >
            <X className="w-7 h-7 text-[#6B6B6B]" />
          </button>
          <button 
            onClick={() => { setShowFullProfile(false); handleSwipe("right"); }}
            className="w-16 h-16 rounded-full bg-[#E63946] shadow-lg flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-white" fill="white" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white shadow-lg border border-[#ECECEC] flex items-center justify-center">
            <Star className="w-7 h-7 text-[#FFB4A2]" fill="#FFB4A2" />
          </button>
        </div>
      </div>
    )
  }

  // Filters Modal
  if (showFilters) {
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF]">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#ECECEC]">
          <button onClick={() => setShowFilters(false)} className="text-[#6B6B6B]">Cancel</button>
          <h1 className="text-lg font-semibold text-[#1C1C1C]">Filters</h1>
          <button className="text-[#E63946] font-medium">Apply</button>
        </div>

        <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
          <div>
            <label className="text-sm font-medium text-[#1C1C1C]">Age Range</label>
            <div className="flex items-center gap-4 mt-2">
              <input type="range" min="18" max="50" defaultValue="26" className="flex-1 accent-[#E63946]" />
              <span className="text-[#1C1C1C] font-medium">26 - 34</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1C1C1C]">Distance</label>
            <div className="flex items-center gap-4 mt-2">
              <input type="range" min="1" max="100" defaultValue="25" className="flex-1 accent-[#E63946]" />
              <span className="text-[#1C1C1C] font-medium">25 km</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1C1C1C]">Looking For</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["Long-term", "Short-term", "Friends", "Not sure"].map((option) => (
                <button
                  key={option}
                  className="py-3 px-4 rounded-xl border border-[#ECECEC] text-sm text-[#1C1C1C] hover:border-[#E63946] hover:bg-[#E63946]/5"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1C1C1C]">Interests</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Travel", "Music", "Art", "Sports", "Food", "Books", "Movies", "Fitness"].map((interest) => (
                <button
                  key={interest}
                  className="py-2 px-4 rounded-full border border-[#ECECEC] text-sm text-[#1C1C1C] hover:border-[#E63946] hover:bg-[#E63946]/5"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      {/* Header with Filter */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1C1C1C]">Discover</h1>
        <button 
          onClick={() => setShowFilters(true)}
          className="p-2 rounded-full bg-[#F5F5F5] flex items-center gap-1"
        >
          <SlidersHorizontal className="w-5 h-5 text-[#6B6B6B]" />
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 pb-2">
        <div 
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setShowFullProfile(true)}
          className={`relative h-full rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ${
            swipeDirection === "left" ? "-translate-x-full rotate-[-10deg] opacity-0" : ""
          } ${swipeDirection === "right" ? "translate-x-full rotate-[10deg] opacity-0" : ""}`}
        >
          <Image
            src={currentProfile.image}
            alt={currentProfile.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Swipe Indicators */}
          {swipeDirection === "left" && (
            <div className="absolute top-1/3 left-6 px-4 py-2 border-4 border-red-500 rounded-lg rotate-[-20deg]">
              <span className="text-red-500 text-2xl font-bold">NOPE</span>
            </div>
          )}
          {swipeDirection === "right" && (
            <div className="absolute top-1/3 right-6 px-4 py-2 border-4 border-green-500 rounded-lg rotate-[20deg]">
              <span className="text-green-500 text-2xl font-bold">LIKE</span>
            </div>
          )}

          {/* Tap to view full profile hint */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <span className="text-white/60 text-xs bg-black/30 px-3 py-1 rounded-full">
              Tap to view full profile
            </span>
          </div>
          
          {/* Profile Info */}
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{currentProfile.name}, {currentProfile.age}</h2>
              {currentProfile.verified && (
                <div className="bg-[#E63946] rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">{currentProfile.distance}</span>
            </div>
            <p className="text-white/90 mt-2 text-sm">{currentProfile.bio}</p>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleSwipe("left"); }}
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <X className="w-7 h-7 text-[#6B6B6B]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSwipe("right"); }}
              className="w-16 h-16 rounded-full bg-[#E63946] shadow-lg flex items-center justify-center"
            >
              <Heart className="w-8 h-8 text-white" fill="white" />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <Star className="w-7 h-7 text-[#FFB4A2]" fill="#FFB4A2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Likes Screen with Toggle
export function LikesScreen() {
  const [activeView, setActiveView] = useState<"received" | "sent">("received")
  
  const receivedLikes = [
    { id: 1, name: "Kavya", age: 27, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop", new: true },
    { id: 2, name: "Meera", age: 25, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop", new: true },
    { id: 3, name: "Riya", age: 28, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop", new: false },
    { id: 4, name: "Diya", age: 26, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", new: false },
  ]

  const sentLikes = [
    { id: 5, name: "Aisha", age: 24, image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop", pending: true },
    { id: 6, name: "Zara", age: 29, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop", pending: false },
  ]

  const suggestedProfiles = [
    { id: 7, name: "Sara", age: 26, image: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=200&h=200&fit=crop", match: "92%" },
    { id: 8, name: "Tara", age: 27, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", match: "88%" },
  ]

  const currentLikes = activeView === "received" ? receivedLikes : sentLikes

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-xl font-bold text-[#1C1C1C]">Likes</h1>
        
        {/* Toggle */}
        <div className="flex bg-[#F5F5F5] rounded-xl p-1 mt-3">
          <button
            onClick={() => setActiveView("received")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === "received"
                ? "bg-white text-[#1C1C1C] shadow-sm"
                : "text-[#6B6B6B]"
            }`}
          >
            Who Likes You ({receivedLikes.length})
          </button>
          <button
            onClick={() => setActiveView("sent")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === "sent"
                ? "bg-white text-[#1C1C1C] shadow-sm"
                : "text-[#6B6B6B]"
            }`}
          >
            Likes Sent ({sentLikes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto pb-24">
        {/* Likes Grid */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {currentLikes.map((person) => (
            <div key={person.id} className="relative rounded-xl overflow-hidden aspect-[3/4]">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {activeView === "received" && "new" in person && person.new && (
                <div className="absolute top-2 left-2 bg-[#E63946] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  NEW
                </div>
              )}
              {activeView === "sent" && "pending" in person && person.pending && (
                <div className="absolute top-2 left-2 bg-[#FFB4A2] text-[#1C1C1C] text-[10px] px-2 py-0.5 rounded-full font-medium">
                  PENDING
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <p className="text-white font-semibold text-sm">{person.name}, {person.age}</p>
              </div>
              {activeView === "received" && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <X className="w-4 h-4 text-[#6B6B6B]" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Profiles Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#1C1C1C]">Suggested For You</h2>
            <button className="text-[#E63946] text-sm font-medium">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {suggestedProfiles.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-32">
                <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 right-2 bg-[#E63946] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {person.match} Match
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <p className="text-white font-semibold text-xs">{person.name}, {person.age}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Chat Screen with Search
export function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  const chats = [
    { id: 1, name: "Priya", lastMessage: "That sounds great! Let's meet...", time: "2m", unread: 2, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", online: true },
    { id: 2, name: "Neha", lastMessage: "I love that book too!", time: "1h", unread: 0, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", online: false },
    { id: 3, name: "Kavya", lastMessage: "How was your weekend?", time: "3h", unread: 1, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", online: true },
  ]

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const messages = [
    { id: 1, text: "Hey! I noticed you love traveling too!", sent: false, time: "10:30 AM" },
    { id: 2, text: "Yes! Just got back from Goa. It was amazing!", sent: true, time: "10:32 AM" },
    { id: 3, text: "Oh wow! I've been wanting to go there. Any recommendations?", sent: false, time: "10:33 AM" },
    { id: 4, text: "Definitely try the cafes in Anjuna. The sunsets are beautiful there!", sent: true, time: "10:35 AM" },
    { id: 5, text: "That sounds great! Let's meet...", sent: false, time: "10:36 AM" },
  ]

  if (selectedChat) {
    const chat = chats.find(c => c.id === selectedChat)
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF]">
        {/* Chat Header */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-[#ECECEC]">
          <button onClick={() => setSelectedChat(null)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-[#1C1C1C]" />
          </button>
          <div className="relative">
            <Image
              src={chat?.image || ""}
              alt={chat?.name || ""}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {chat?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[#1C1C1C]">{chat?.name}</h2>
            <p className="text-xs text-[#6B6B6B]">{chat?.online ? "Online" : "Offline"}</p>
          </div>
          <button className="p-2 rounded-full bg-[#F5F5F5]">
            <Gift className="w-5 h-5 text-[#E63946]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                msg.sent 
                  ? "bg-[#E63946] text-white rounded-br-sm" 
                  : "bg-[#F5F5F5] text-[#1C1C1C] rounded-bl-sm"
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sent ? "text-white/70" : "text-[#6B6B6B]"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[#ECECEC] pb-20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-[#F5F5F5] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#E63946]/20"
            />
            <button className="w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-xl font-bold text-[#1C1C1C]">Messages</h1>
        
        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E63946]/20"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F5F5F5] transition-colors"
          >
            <div className="relative">
              <Image
                src={chat.image}
                alt={chat.name}
                width={52}
                height={52}
                className="rounded-full object-cover"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1C1C1C]">{chat.name}</h3>
                <span className="text-xs text-[#6B6B6B]">{chat.time}</span>
              </div>
              <p className="text-sm text-[#6B6B6B] truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#E63946] flex items-center justify-center">
                <span className="text-xs text-white font-medium">{chat.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Profile Screen with Completion Status
export function ProfileScreen({ userProfile }: { userProfile: UserProfile }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const profileSections = [
    { id: "photos", label: "Photos", filled: 1, total: 6 },
    { id: "bio", label: "Bio & Basics", filled: userProfile.introLine ? 1 : 0, total: 1 },
    { id: "interests", label: "Interests", filled: userProfile.interests ? 1 : 0, total: 1 },
    { id: "lifestyle", label: "Lifestyle", filled: userProfile.lifestyle ? 1 : 0, total: 1 },
    { id: "prompts", label: "Prompts", filled: userProfile.promptAnswer ? 1 : 0, total: 3 },
  ]

  const completedSections = profileSections.reduce((acc, section) => acc + section.filled, 0)
  const totalSections = profileSections.reduce((acc, section) => acc + section.total, 0)
  const completionPercentage = Math.round((completedSections / totalSections) * 100)

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1C1C1C]">Profile</h1>
        <button className="p-2 rounded-full bg-[#F5F5F5]">
          <Settings className="w-5 h-5 text-[#6B6B6B]" />
        </button>
      </div>

      {/* Profile Completion Card */}
      <div className="mx-4 mt-2 bg-gradient-to-r from-[#E63946] to-[#C1121F] rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Profile Completion</h3>
            <p className="text-white/80 text-sm">{completionPercentage}% complete</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl font-bold">{completionPercentage}%</span>
          </div>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-white/80 text-xs mt-2">Complete your profile to get more matches!</p>
      </div>

      {/* Profile Photo */}
      <div className="px-4 py-4">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
          <Image
            src={userProfile.heroPhoto}
            alt={userProfile.firstName}
            fill
            className="object-cover"
          />
          <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center shadow-lg">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1C]">{userProfile.firstName || "Your Name"}, {userProfile.age || "Age"}</h2>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] text-sm">{userProfile.city || "Your City"}</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#F5F5F5] rounded-full flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#1C1C1C]" />
            <span className="text-sm font-medium text-[#1C1C1C]">Edit</span>
          </button>
        </div>

        {/* Profile Sections */}
        <div className="space-y-2">
          {profileSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  section.filled === section.total ? "bg-[#E63946]/20" : "bg-[#ECECEC]"
                }`}>
                  {section.filled === section.total ? (
                    <Check className="w-4 h-4 text-[#E63946]" />
                  ) : (
                    <span className="text-xs text-[#6B6B6B]">{section.filled}/{section.total}</span>
                  )}
                </div>
                <span className="font-medium text-[#1C1C1C]">{section.label}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-[#6B6B6B]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
              )}
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className="pt-4 space-y-3">
          <h3 className="font-semibold text-[#1C1C1C]">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-[#F5F5F5] rounded-xl flex flex-col items-center gap-2">
              <Settings className="w-6 h-6 text-[#6B6B6B]" />
              <span className="text-sm text-[#1C1C1C]">Settings</span>
            </button>
            <button className="p-4 bg-[#F5F5F5] rounded-xl flex flex-col items-center gap-2">
              <Shield className="w-6 h-6 text-[#6B6B6B]" />
              <span className="text-sm text-[#1C1C1C]">Privacy</span>
            </button>
            <button className="p-4 bg-[#F5F5F5] rounded-xl flex flex-col items-center gap-2">
              <Crown className="w-6 h-6 text-[#FFB4A2]" />
              <span className="text-sm text-[#1C1C1C]">Premium</span>
            </button>
            <button className="p-4 bg-[#F5F5F5] rounded-xl flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-[#6B6B6B]" />
              <span className="text-sm text-[#1C1C1C]">Invite Friends</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Personality Screen with Membership and Blog Posts
export function PersonalityScreen({ userProfile }: { userProfile: UserProfile }) {
  const [showMembershipPlans, setShowMembershipPlans] = useState(false)
  
  const traits = [
    { name: "Openness", value: 85, color: "#E63946" },
    { name: "Conscientiousness", value: 72, color: "#FFB4A2" },
    { name: "Extraversion", value: 68, color: "#C1121F" },
    { name: "Agreeableness", value: 90, color: "#E63946" },
    { name: "Emotional Stability", value: 78, color: "#FFB4A2" },
  ]

  const membershipPlans = [
    {
      name: "Basic",
      price: "Free",
      features: ["5 likes per day", "Basic matches", "Limited messages"],
      popular: false,
    },
    {
      name: "Premium",
      price: "499/mo",
      features: ["Unlimited likes", "See who likes you", "Priority matches", "Read receipts"],
      popular: true,
    },
    {
      name: "VIP",
      price: "999/mo",
      features: ["Everything in Premium", "Profile boost weekly", "Incognito mode", "Direct support"],
      popular: false,
    },
  ]

  const blogPosts = [
    {
      id: 1,
      category: "Dating Tips",
      title: "5 First Date Conversation Starters",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=200&fit=crop",
      readTime: "3 min",
    },
    {
      id: 2,
      category: "Mental Peace",
      title: "Managing Dating Anxiety",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop",
      readTime: "5 min",
    },
    {
      id: 3,
      category: "Health",
      title: "Self-Care While Dating",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
      readTime: "4 min",
    },
    {
      id: 4,
      category: "Relationships",
      title: "Building Healthy Boundaries",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop",
      readTime: "6 min",
    },
  ]

  const digitalGifts = [
    { id: 1, name: "Rose", price: 49, icon: "🌹" },
    { id: 2, name: "Coffee", price: 99, icon: "☕" },
    { id: 3, name: "Star", price: 149, icon: "⭐" },
    { id: 4, name: "Heart", price: 199, icon: "💝" },
  ]

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-xl font-bold text-[#1C1C1C]">Personality</h1>
        <p className="text-sm text-[#6B6B6B]">Your compatibility insights</p>
      </div>

      {/* Membership Banner */}
      <div className="mx-4 mt-2">
        <button 
          onClick={() => setShowMembershipPlans(!showMembershipPlans)}
          className="w-full bg-gradient-to-r from-[#E63946] to-[#C1121F] rounded-2xl p-4 text-white flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold">Upgrade to Premium</h3>
            <p className="text-white/80 text-sm">See who likes you & more</p>
          </div>
          {showMembershipPlans ? (
            <ChevronUp className="w-5 h-5 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Membership Plans */}
        {showMembershipPlans && (
          <div className="mt-3 space-y-3">
            {membershipPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`p-4 rounded-xl border-2 ${
                  plan.popular 
                    ? "border-[#E63946] bg-[#E63946]/5" 
                    : "border-[#ECECEC] bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1C1C1C]">{plan.name}</h4>
                    {plan.popular && (
                      <span className="text-[10px] bg-[#E63946] text-white px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#1C1C1C]">{plan.price}</span>
                </div>
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-[#6B6B6B] flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#E63946]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-3 py-2 rounded-xl font-medium ${
                  plan.popular 
                    ? "bg-[#E63946] text-white" 
                    : "bg-[#F5F5F5] text-[#1C1C1C]"
                }`}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Gifts Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1C1C1C]">Send Digital Gifts</h3>
          <Gift className="w-5 h-5 text-[#E63946]" />
        </div>
        <p className="text-sm text-[#6B6B6B] mb-3">Send thoughtful gifts without sharing addresses</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {digitalGifts.map((gift) => (
            <button 
              key={gift.id}
              className="flex-shrink-0 w-20 p-3 bg-[#F5F5F5] rounded-xl flex flex-col items-center gap-1 hover:bg-[#FFB4A2]/20 transition-colors"
            >
              <span className="text-2xl">{gift.icon}</span>
              <span className="text-xs font-medium text-[#1C1C1C]">{gift.name}</span>
              <span className="text-xs text-[#6B6B6B]">{gift.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Personality Card */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-br from-[#FFB4A2]/30 to-[#E63946]/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E63946] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#1C1C1C]">The Intentional Romantic</h2>
              <p className="text-[#6B6B6B] text-sm">Your personality type</p>
            </div>
          </div>
          <p className="text-[#1C1C1C] text-sm leading-relaxed">
            You approach relationships with purpose and clarity. You seek meaningful connections built on mutual respect and shared values.
          </p>
        </div>
      </div>

      {/* Traits */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-[#1C1C1C] mb-4">Your Traits</h3>
        <div className="space-y-4">
          {traits.map((trait) => (
            <div key={trait.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-[#1C1C1C]">{trait.name}</span>
                <span className="text-sm text-[#6B6B6B]">{trait.value}%</span>
              </div>
              <div className="h-2 bg-[#ECECEC] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${trait.value}%`, backgroundColor: trait.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1C1C1C]">Insights & Tips</h3>
          <button className="text-[#E63946] text-sm font-medium">See All</button>
        </div>
        
        <div className="space-y-3">
          {blogPosts.map((post) => (
            <button key={post.id} className="w-full flex gap-3 bg-[#F5F5F5] rounded-xl p-3 text-left">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-medium text-[#E63946] uppercase">{post.category}</span>
                <h4 className="font-medium text-[#1C1C1C] text-sm mt-1 line-clamp-2">{post.title}</h4>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-[#6B6B6B]" />
                  <span className="text-xs text-[#6B6B6B]">{post.readTime} read</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

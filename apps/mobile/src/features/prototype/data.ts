export type PrototypeUserProfile = {
  firstName: string;
  age: string;
  gender: string;
  lookingFor: string;
  city: string;
  heroPhoto: string;
  introLine: string;
  promptAnswer: string;
  interests: string;
  lifestyle: string;
  personality: string;
  location: string;
  minAge: string;
  maxAge: string;
  radiusKm: string;
  intent: string;
};

export const initialPrototypeProfile: PrototypeUserProfile = {
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
};

export const suggestedCities = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

export const samplePhotos = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
];

export const promptOptions = [
  "Consistency and kindness.",
  "Someone who makes me laugh.",
  "Deep conversations and honesty.",
  "Adventure and spontaneity.",
];

export const lifestyleOptions = [
  "Early riser, mostly vegetarian, family-oriented.",
  "Night owl, non-veg, independent.",
  "Balanced routine, health-conscious.",
  "Spontaneous, social butterfly.",
];

export const personalityOptions = [
  "Optimistic, emotionally direct, and a little playful.",
  "Introverted, thoughtful, and creative.",
  "Extroverted, adventurous, and bold.",
  "Calm, grounded, and supportive.",
];

export const allInterests = [
  "Travel",
  "Books",
  "Pilates",
  "Music",
  "Movies",
  "Cooking",
  "Fitness",
  "Art",
  "Photography",
  "Gaming",
  "Hiking",
  "Dancing",
  "Yoga",
  "Coffee",
  "Wine",
  "Tech",
  "Fashion",
  "Nature",
];

export const discoverProfiles = [
  {
    id: "priya",
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
    id: "neha",
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
    id: "ananya",
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
];

export const receivedLikes = [
  { id: "kavya", name: "Kavya", age: 27, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop", isNew: true },
  { id: "meera", name: "Meera", age: 25, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop", isNew: true },
  { id: "riya", name: "Riya", age: 28, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop", isNew: false },
  { id: "diya", name: "Diya", age: 26, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", isNew: false },
];

export const sentLikes = [
  { id: "aisha", name: "Aisha", age: 24, image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop", pending: true },
  { id: "zara", name: "Zara", age: 29, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop", pending: false },
];

export const suggestedProfiles = [
  { id: "sara", name: "Sara", age: 26, image: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=200&h=200&fit=crop", match: "92%" },
  { id: "tara", name: "Tara", age: 27, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", match: "88%" },
];

export const chatThreads = [
  {
    id: "1",
    name: "Priya",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    lastMessage: "That museum date idea actually sounds perfect.",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Neha",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    lastMessage: "I know a coffee place you would love.",
    time: "1h",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Ananya",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    lastMessage: "Tell me your comfort movie pick.",
    time: "3h",
    unread: 1,
    online: true,
  },
];

export const sampleMessages = [
  { id: "m1", text: "You seem like someone who plans soft but memorable dates.", sent: false, time: "7:12 PM" },
  { id: "m2", text: "That is suspiciously accurate.", sent: true, time: "7:13 PM" },
  { id: "m3", text: "Museum and coffee this weekend?", sent: false, time: "7:14 PM" },
];

export const personalityTraits = [
  { name: "Openness", value: 85, color: "#E63946" },
  { name: "Conscientiousness", value: 72, color: "#FFB4A2" },
  { name: "Extraversion", value: 68, color: "#C1121F" },
  { name: "Agreeableness", value: 90, color: "#E63946" },
  { name: "Emotional Stability", value: 78, color: "#FFB4A2" },
];

export const membershipPlans = [
  { name: "Basic", price: "Free", features: ["5 likes per day", "Basic matches", "Limited messages"], popular: false },
  { name: "Premium", price: "499/mo", features: ["Unlimited likes", "See who likes you", "Priority matches", "Read receipts"], popular: true },
  { name: "VIP", price: "999/mo", features: ["Everything in Premium", "Profile boost weekly", "Incognito mode", "Direct support"], popular: false },
];

export const digitalGifts = [
  { id: "rose", name: "Rose", price: 49, icon: "Rose" },
  { id: "coffee", name: "Coffee", price: 99, icon: "Coffee" },
  { id: "star", name: "Star", price: 149, icon: "Star" },
  { id: "heart", name: "Heart", price: 199, icon: "Heart" },
];

export const blogPosts = [
  {
    id: "1",
    category: "Dating Tips",
    title: "5 First Date Conversation Starters",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=200&fit=crop",
    readTime: "3 min",
  },
  {
    id: "2",
    category: "Mental Peace",
    title: "Managing Dating Anxiety",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop",
    readTime: "5 min",
  },
  {
    id: "3",
    category: "Health",
    title: "Self-Care While Dating",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
    readTime: "4 min",
  },
];

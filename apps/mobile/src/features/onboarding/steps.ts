import type { OnboardingStepId } from "../../types/app";

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  description: string;
  required: boolean;
  canSkip: boolean;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "basic-profile",
    title: "Core identity",
    description: "Name, age, gender, looking for, and the details needed to activate the account.",
    required: true,
    canSkip: false,
  },
  {
    id: "media",
    title: "Photos and intro",
    description: "Add a hero photo and optional extra photos or a short intro video.",
    required: true,
    canSkip: false,
  },
  {
    id: "prompts",
    title: "Prompts and bio",
    description: "Show personality with profile prompts, a short bio, and conversation openers.",
    required: false,
    canSkip: true,
  },
  {
    id: "interests",
    title: "Interests",
    description: "Give the ranking engine better signals by selecting hobbies and passions.",
    required: false,
    canSkip: true,
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    description: "Habits, goals, religion, and relationship preferences.",
    required: false,
    canSkip: true,
  },
  {
    id: "personality",
    title: "Personality",
    description: "Weighted questions that improve compatibility and the AI explanation layer.",
    required: false,
    canSkip: true,
  },
  {
    id: "location",
    title: "Location",
    description: "Optional nearby discovery with privacy-friendly controls.",
    required: false,
    canSkip: true,
  },
  {
    id: "preferences",
    title: "Discovery preferences",
    description: "Age range, radius, and intent filters used when the feed starts.",
    required: true,
    canSkip: false,
  },
];

import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

const suggestions = [
  "Warm, curious, and ready for something intentional.",
  "Coffee lover seeking my adventure partner.",
  "Bookworm with a love for spontaneous trips.",
];

export default function IntroScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const isStepComplete = profile.introLine.trim().length > 0;

  return (
    <OnboardingScaffold
      step={6}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("intro");
        router.replace("/(onboarding)/prompt");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/photo")}
      onPrimary={() => router.replace("/(onboarding)/prompt")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="Write your intro" subtitle="A short line that captures your vibe" />
        <TextInput
          multiline
          onChangeText={(value) => updateProfile("introLine", value)}
          placeholder="Describe yourself in a line..."
          placeholderTextColor="#6B6B6B"
          style={[styles.input, styles.textarea]}
          value={profile.introLine}
        />
        <Text style={styles.sectionLabel}>Need inspiration?</Text>
        <View style={styles.stack}>
          {suggestions.map((item) => (
            <Pressable key={item} onPress={() => updateProfile("introLine", item)} style={styles.suggestionCard}>
              <Text style={styles.suggestionText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

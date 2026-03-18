import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

export default function AgeScreen() {
  const { profile, updateProfile } = useAppFlow();
  const isStepComplete = profile.age.trim().length > 0;

  return (
    <OnboardingScaffold
      step={1}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/name")}
      onPrimary={() => router.replace("/(onboarding)/gender")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="How old are you?" subtitle="Your age will be shown on your profile" />
        <View style={styles.ageGrid}>
          {Array.from({ length: 63 }, (_, index) => String(index + 18)).map((age) => (
            <Pressable key={age} onPress={() => updateProfile("age", age)} style={[styles.ageChip, profile.age === age ? styles.ageChipActive : null]}>
              <Text style={[styles.ageChipText, profile.age === age ? styles.ageChipTextActive : null]}>{age}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

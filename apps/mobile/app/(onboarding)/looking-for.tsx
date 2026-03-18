import { View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

export default function LookingForScreen() {
  const { profile, updateProfile } = useAppFlow();
  const options = ["Long-term relationship", "Short-term relationship", "New friends", "Still figuring it out"];
  const isStepComplete = profile.lookingFor.trim().length > 0;

  return (
    <OnboardingScaffold
      step={3}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/gender")}
      onPrimary={() => router.replace("/(onboarding)/city")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="What are you looking for?" subtitle="We'll match you with like-minded people" />
        <View style={styles.stack}>
          {options.map((item) => (
            <OptionButton key={item} label={item} selected={profile.lookingFor === item} onPress={() => updateProfile("lookingFor", item)} />
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

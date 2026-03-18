import { View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

export default function GenderScreen() {
  const { profile, updateProfile } = useAppFlow();
  const options = ["Woman", "Man", "Non-binary", "Prefer not to say"];
  const isStepComplete = profile.gender.trim().length > 0;

  return (
    <OnboardingScaffold
      step={2}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/age")}
      onPrimary={() => router.replace("/(onboarding)/looking-for")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="How do you identify?" subtitle="Select the option that best describes you" />
        <View style={styles.stack}>
          {options.map((item) => (
            <OptionButton key={item} label={item} selected={profile.gender === item} onPress={() => updateProfile("gender", item)} />
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

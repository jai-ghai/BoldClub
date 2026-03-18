import { View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { personalityOptions } from "../../src/features/prototype/data";

export default function PersonalityStepScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const isStepComplete = profile.personality.trim().length > 0;

  return (
    <OnboardingScaffold
      step={10}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("personality");
        router.replace("/(onboarding)/preferences");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/lifestyle")}
      onPrimary={() => router.replace("/(onboarding)/preferences")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="How would you describe your personality?" subtitle="Let your true self shine" />
        <View style={styles.stack}>
          {personalityOptions.map((item) => (
            <OptionButton key={item} label={item} selected={profile.personality === item} onPress={() => updateProfile("personality", item)} />
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

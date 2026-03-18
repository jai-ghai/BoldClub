import { Text, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { ChipButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { allInterests } from "../../src/features/prototype/data";

export default function InterestsScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const selected = profile.interests ? profile.interests.split(", ").filter(Boolean) : [];
  const isStepComplete = selected.length > 0;

  return (
    <OnboardingScaffold
      step={8}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("interests");
        router.replace("/(onboarding)/lifestyle");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/prompt")}
      onPrimary={() => router.replace("/(onboarding)/lifestyle")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="What are your interests?" subtitle="Select up to 6 interests" />
        <View style={styles.chipsWrap}>
          {allInterests.map((interest) => {
            const normalized = interest.toLowerCase();
            const isSelected = selected.includes(normalized);

            return (
              <ChipButton
                key={interest}
                label={interest}
                selected={isSelected}
                onPress={() => {
                  if (isSelected) {
                    updateProfile(
                      "interests",
                      selected.filter((item) => item !== normalized).join(", "),
                    );
                  } else if (selected.length < 6) {
                    updateProfile("interests", [...selected, normalized].join(", "));
                  }
                }}
              />
            );
          })}
        </View>
        <Text style={styles.counterText}>Selected: {selected.length}/6</Text>
      </View>
    </OnboardingScaffold>
  );
}

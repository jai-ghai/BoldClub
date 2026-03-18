import { TextInput, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { lifestyleOptions } from "../../src/features/prototype/data";

export default function LifestyleScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const isStepComplete = profile.lifestyle.trim().length > 0;

  return (
    <OnboardingScaffold
      step={9}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("lifestyle");
        router.replace("/(onboarding)/personality");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/interests")}
      onPrimary={() => router.replace("/(onboarding)/personality")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="Describe your lifestyle" subtitle="Help others understand your daily life" />
        <View style={styles.stack}>
          {lifestyleOptions.map((item) => (
            <OptionButton key={item} label={item} selected={profile.lifestyle === item} onPress={() => updateProfile("lifestyle", item)} />
          ))}
        </View>
        <TextInput
          multiline
          onChangeText={(value) => updateProfile("lifestyle", value)}
          placeholder="Or describe in your own words..."
          placeholderTextColor="#6B6B6B"
          style={[styles.input, styles.shortTextarea]}
          value={lifestyleOptions.includes(profile.lifestyle) ? "" : profile.lifestyle}
        />
      </View>
    </OnboardingScaffold>
  );
}

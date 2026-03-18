import { TextInput, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

export default function NameScreen() {
  const { profile, updateProfile } = useAppFlow();
  const isStepComplete = profile.firstName.trim().length > 0;

  return (
    <OnboardingScaffold
      step={0}
      totalSteps={12}
      canGoBack={false}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onPrimary={() => router.replace("/(onboarding)/age")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="What's your first name?" subtitle="This is how you'll appear to others" />
        <TextInput
          onChangeText={(value) => updateProfile("firstName", value)}
          placeholder="Enter your name"
          placeholderTextColor="#6B6B6B"
          style={styles.input}
          value={profile.firstName}
        />
      </View>
    </OnboardingScaffold>
  );
}

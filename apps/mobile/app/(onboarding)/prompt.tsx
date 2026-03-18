import { TextInput, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { promptOptions } from "../../src/features/prototype/data";

export default function PromptScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const isStepComplete = profile.promptAnswer.trim().length > 0;

  return (
    <OnboardingScaffold
      step={7}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("prompt");
        router.replace("/(onboarding)/interests");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/intro")}
      onPrimary={() => router.replace("/(onboarding)/interests")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="What matters most to you in a partner?" subtitle="Select or write your own" />
        <View style={styles.stack}>
          {promptOptions.map((item) => (
            <OptionButton key={item} label={item} selected={profile.promptAnswer === item} onPress={() => updateProfile("promptAnswer", item)} />
          ))}
        </View>
        <TextInput
          multiline
          onChangeText={(value) => updateProfile("promptAnswer", value)}
          placeholder="Or write your own..."
          placeholderTextColor="#6B6B6B"
          style={[styles.input, styles.shortTextarea]}
          value={promptOptions.includes(profile.promptAnswer) ? "" : profile.promptAnswer}
        />
      </View>
    </OnboardingScaffold>
  );
}

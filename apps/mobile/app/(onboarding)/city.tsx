import { TextInput, View } from "react-native";
import { router } from "expo-router";

import { MapPinIcon } from "../../src/components/icons";
import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { ChipButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { suggestedCities } from "../../src/features/prototype/data";

export default function CityScreen() {
  const { profile, updateProfile } = useAppFlow();
  const isStepComplete = profile.city.trim().length > 0;

  return (
    <OnboardingScaffold
      step={4}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/looking-for")}
      onPrimary={() => router.replace("/(onboarding)/photo")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="Where do you live?" subtitle="Find people near you" />
        <View style={styles.iconInputWrap}>
          <View style={styles.iconInput}>
            <MapPinIcon color="#6B6B6B" size={18} />
          </View>
          <TextInput
            onChangeText={(value) => updateProfile("city", value)}
            placeholder="Search your city"
            placeholderTextColor="#6B6B6B"
            style={[styles.input, styles.inputWithIcon]}
            value={profile.city}
          />
        </View>
        <View style={styles.chipsWrap}>
          {suggestedCities.map((city) => (
            <ChipButton key={city} label={city} selected={profile.city === city} onPress={() => updateProfile("city", city)} />
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

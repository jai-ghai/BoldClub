import { Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { MapPinIcon, SettingsIcon } from "../../src/components/icons";
import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { OptionButton, StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

export default function PreferencesScreen() {
  const { profile, updateProfile, completeOnboarding } = useAppFlow();
  const hasValidAgeRange =
    profile.minAge.trim().length > 0 &&
    profile.maxAge.trim().length > 0 &&
    Number(profile.minAge) >= 18 &&
    Number(profile.maxAge) >= Number(profile.minAge);
  const hasValidRadius = profile.radiusKm.trim().length > 0 && Number(profile.radiusKm) > 0;
  const isStepComplete = hasValidAgeRange && hasValidRadius && profile.intent.trim().length > 0;

  return (
    <OnboardingScaffold
      step={11}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Complete"
      onBack={() => router.replace("/(onboarding)/personality")}
      onPrimary={() => {
        completeOnboarding();
        router.replace("/(tabs)/discover");
      }}
    >
      <View style={styles.stepContent}>
        <StepHeader title="Set your preferences" subtitle="Find your ideal match" />

        <View style={styles.preferenceCard}>
          <View style={styles.preferenceLabelRow}>
            <SettingsIcon color="#E63946" size={18} />
            <Text style={styles.preferenceLabel}>Age Range</Text>
          </View>
          <View style={styles.rangeRow}>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateProfile("minAge", value)} style={styles.rangeInput} value={profile.minAge} />
            <Text style={styles.rangeText}>to</Text>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateProfile("maxAge", value)} style={styles.rangeInput} value={profile.maxAge} />
            <Text style={styles.rangeText}>years</Text>
          </View>
        </View>

        <View style={styles.preferenceCard}>
          <View style={styles.preferenceLabelRow}>
            <MapPinIcon color="#E63946" size={18} />
            <Text style={styles.preferenceLabel}>Distance</Text>
          </View>
          <View style={styles.rangeRow}>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateProfile("radiusKm", value)} style={styles.rangeInputWide} value={profile.radiusKm} />
            <Text style={styles.rangeText}>km</Text>
          </View>
        </View>

        <Text style={styles.preferenceHeading}>Dating Intent</Text>
        <View style={styles.stack}>
          {["Serious dating", "Casual dating", "Open to anything"].map((item) => (
            <OptionButton key={item} label={item} selected={profile.intent === item} onPress={() => updateProfile("intent", item)} />
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

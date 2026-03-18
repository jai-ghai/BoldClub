import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";
import { samplePhotos } from "../../src/features/prototype/data";

export default function PhotoScreen() {
  const { profile, skipOnboardingRoute, updateProfile } = useAppFlow();
  const isStepComplete = profile.heroPhoto.trim().length > 0;

  return (
    <OnboardingScaffold
      step={5}
      totalSteps={12}
      secondaryLabel="Skip"
      onSecondary={() => {
        skipOnboardingRoute("photo");
        router.replace("/(onboarding)/intro");
      }}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/city")}
      onPrimary={() => router.replace("/(onboarding)/intro")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="Add your best photo" subtitle="A clear face photo works best" />
        {profile.heroPhoto ? (
          <View style={styles.heroPhotoWrap}>
            <Image source={{ uri: profile.heroPhoto }} style={styles.heroPhoto} />
            <Pressable onPress={() => updateProfile("heroPhoto", "")} style={styles.photoRemoveButton}>
              <Text style={styles.photoRemoveButtonText}>×</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Add Photo</Text>
          </View>
        )}
        <Text style={styles.helperText}>Or choose a sample:</Text>
        <View style={styles.samplePhotoRow}>
          {samplePhotos.map((photo) => (
            <Pressable key={photo} onPress={() => updateProfile("heroPhoto", photo)}>
              <Image source={{ uri: photo }} style={[styles.samplePhoto, profile.heroPhoto === photo ? styles.samplePhotoActive : null]} />
            </Pressable>
          ))}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

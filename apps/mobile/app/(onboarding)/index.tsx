import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon, SettingsIcon } from "../../src/components/icons";
import {
  allInterests,
  initialPrototypeProfile,
  lifestyleOptions,
  personalityOptions,
  promptOptions,
  samplePhotos,
  suggestedCities,
  type PrototypeUserProfile,
} from "../../src/features/prototype/data";
import { ApiError } from "../../src/lib/api";
import { completeOnboarding, getOnboardingPlan, saveOnboardingStep, skipOnboardingStep } from "../../src/services/onboarding";

const TOTAL_STEPS = 12;

function stepFromBackend(currentStep: string | null) {
  switch (currentStep) {
    case "basic-profile":
      return 0;
    case "media":
      return 5;
    case "prompts":
      return 7;
    case "interests":
      return 8;
    case "lifestyle":
      return 9;
    case "personality":
      return 10;
    case "location":
      return 11;
    case "preferences":
      return 11;
    default:
      return 0;
  }
}

function OnboardingButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.ctaButton}>
      <Text style={styles.ctaButtonText}>{label}</Text>
      <ChevronRightIcon color="#FFFFFF" size={18} />
    </Pressable>
  );
}

function SelectChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.optionChip, selected ? styles.optionChipActive : null]}>
      <Text style={[styles.optionChipText, selected ? styles.optionChipTextActive : null]}>{label}</Text>
      {selected ? <CheckIcon color="#FFFFFF" size={16} /> : null}
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PrototypeUserProfile>(initialPrototypeProfile);

  useEffect(() => {
    async function loadPlan() {
      setLoading(true);
      setError(null);

      try {
        const plan = await getOnboardingPlan();
        setStep(stepFromBackend(plan.current_step));
      } catch (loadError) {
        if (loadError instanceof ApiError && (loadError.status === 401 || loadError.status === 403)) {
          router.replace("/");
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load onboarding.");
      } finally {
        setLoading(false);
      }
    }

    void loadPlan();
  }, []);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const selectedInterests = useMemo(() => (form.interests ? form.interests.split(", ").filter(Boolean) : []), [form.interests]);

  function updateForm<K extends keyof PrototypeUserProfile>(key: K, value: PrototypeUserProfile[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateCurrentStep() {
    switch (step) {
      case 0:
        return form.firstName.trim() ? null : "Enter your first name.";
      case 1:
        return form.age.trim() ? null : "Select your age.";
      case 2:
        return form.gender.trim() ? null : "Choose your gender identity.";
      case 3:
        return form.lookingFor.trim() ? null : "Choose what you are looking for.";
      case 4:
        return form.city.trim() ? null : "Choose your city.";
      case 5:
        return form.heroPhoto.trim() ? null : "Choose a profile photo.";
      case 6:
        return form.introLine.trim() ? null : "Write your intro line.";
      case 11:
        return form.intent.trim() ? null : "Choose your dating intent.";
      default:
        return null;
    }
  }

  async function persistForStep(currentStep: number, skipping = false) {
    if (currentStep <= 4) {
      await saveOnboardingStep("basic-profile", {
        first_name: form.firstName.trim(),
        age: Number(form.age),
        gender_identity: form.gender.trim(),
        looking_for: form.lookingFor.trim(),
        city: form.city.trim(),
      });
      return;
    }

    if (currentStep === 5 || currentStep === 6) {
      await saveOnboardingStep("media", {
        hero_photo_url: form.heroPhoto.trim(),
        intro_headline: form.introLine.trim(),
      });
      return;
    }

    if (currentStep === 7) {
      if (skipping) {
        await skipOnboardingStep("prompts");
      } else {
        await saveOnboardingStep("prompts", {
          prompts: [{ question: "What matters most to you in a partner?", answer: form.promptAnswer.trim() }],
        });
      }
      return;
    }

    if (currentStep === 8) {
      if (skipping) {
        await skipOnboardingStep("interests");
      } else {
        await saveOnboardingStep("interests", {
          interests: selectedInterests,
        });
      }
      return;
    }

    if (currentStep === 9) {
      if (skipping) {
        await skipOnboardingStep("lifestyle");
      } else {
        await saveOnboardingStep("lifestyle", {
          lifestyle_summary: form.lifestyle.trim(),
        });
      }
      return;
    }

    if (currentStep === 10) {
      if (skipping) {
        await skipOnboardingStep("personality");
      } else {
        await saveOnboardingStep("personality", {
          personality_notes: form.personality.trim(),
        });
      }
      await skipOnboardingStep("location");
      return;
    }

    if (currentStep === 11) {
      await saveOnboardingStep("preferences", {
        min_age: Number(form.minAge),
        max_age: Number(form.maxAge),
        radius_km: Number(form.radiusKm),
        intent: form.intent.trim(),
      });
      await completeOnboarding();
    }
  }

  async function handleContinue() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await persistForStep(step, false);

      if (step === TOTAL_STEPS - 1) {
        router.replace("/(tabs)/discover");
        return;
      }

      setStep((current) => current + 1);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this step.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSkipOptional() {
    if (![7, 8, 9, 10].includes(step)) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await persistForStep(step, true);
      setStep((current) => current + 1);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to skip this step.");
    } finally {
      setSaving(false);
    }
  }

  function renderStep() {
    if (step === 0) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What's your first name?</Text>
          <Text style={styles.stepSubtitle}>This is how you'll appear to others</Text>
          <TextInput
            onChangeText={(value) => updateForm("firstName", value)}
            placeholder="Enter your name"
            placeholderTextColor="#6B6B6B"
            style={styles.input}
            value={form.firstName}
          />
        </View>
      );
    }

    if (step === 1) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>How old are you?</Text>
          <Text style={styles.stepSubtitle}>Your age will be shown on your profile</Text>
          <View style={styles.ageGrid}>
            {Array.from({ length: 63 }, (_, index) => String(index + 18)).map((age) => (
              <Pressable key={age} onPress={() => updateForm("age", age)} style={[styles.ageChip, form.age === age ? styles.ageChipActive : null]}>
                <Text style={[styles.ageChipText, form.age === age ? styles.ageChipTextActive : null]}>{age}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>How do you identify?</Text>
          <Text style={styles.stepSubtitle}>Select the option that best describes you</Text>
          <View style={styles.stack}>
            {["Woman", "Man", "Non-binary", "Prefer not to say"].map((item) => (
              <SelectChip key={item} label={item} onPress={() => updateForm("gender", item)} selected={form.gender === item} />
            ))}
          </View>
        </View>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What are you looking for?</Text>
          <Text style={styles.stepSubtitle}>We'll match you with like-minded people</Text>
          <View style={styles.stack}>
            {["Long-term relationship", "Short-term relationship", "New friends", "Still figuring it out"].map((item) => (
              <SelectChip key={item} label={item} onPress={() => updateForm("lookingFor", item)} selected={form.lookingFor === item} />
            ))}
          </View>
        </View>
      );
    }

    if (step === 4) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Where do you live?</Text>
          <Text style={styles.stepSubtitle}>Find people near you</Text>
          <View style={styles.iconInputWrap}>
            <View style={styles.iconInput}>
              <MapPinIcon color="#6B6B6B" size={18} />
            </View>
            <TextInput
              onChangeText={(value) => updateForm("city", value)}
              placeholder="Search your city"
              placeholderTextColor="#6B6B6B"
              style={[styles.input, styles.inputWithIcon]}
              value={form.city}
            />
          </View>
          <View style={styles.cityWrap}>
            {suggestedCities.map((city) => (
              <Pressable key={city} onPress={() => updateForm("city", city)} style={[styles.cityChip, form.city === city ? styles.cityChipActive : null]}>
                <Text style={[styles.cityChipText, form.city === city ? styles.cityChipTextActive : null]}>{city}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (step === 5) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Add your best photo</Text>
          <Text style={styles.stepSubtitle}>A clear face photo works best</Text>
          {form.heroPhoto ? (
            <Image source={{ uri: form.heroPhoto }} style={styles.heroPhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Add Photo</Text>
            </View>
          )}
          <Text style={styles.helperText}>Or choose a sample:</Text>
          <View style={styles.samplePhotoRow}>
            {samplePhotos.map((photo) => (
              <Pressable key={photo} onPress={() => updateForm("heroPhoto", photo)}>
                <Image source={{ uri: photo }} style={[styles.samplePhoto, form.heroPhoto === photo ? styles.samplePhotoActive : null]} />
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (step === 6) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Write your intro</Text>
          <Text style={styles.stepSubtitle}>A short line that captures your vibe</Text>
          <TextInput
            multiline
            onChangeText={(value) => updateForm("introLine", value)}
            placeholder="Describe yourself in a line..."
            placeholderTextColor="#6B6B6B"
            style={[styles.input, styles.textarea]}
            value={form.introLine}
          />
          <Text style={styles.helperText}>Need inspiration?</Text>
          <View style={styles.stack}>
            {[
              "Warm, curious, and ready for something intentional.",
              "Coffee lover seeking my adventure partner.",
              "Bookworm with a love for spontaneous trips.",
            ].map((item) => (
              <Pressable key={item} onPress={() => updateForm("introLine", item)} style={styles.suggestionCard}>
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (step === 7) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What matters most to you in a partner?</Text>
          <Text style={styles.stepSubtitle}>Select or write your own</Text>
          <View style={styles.stack}>
            {promptOptions.map((item) => (
              <SelectChip key={item} label={item} onPress={() => updateForm("promptAnswer", item)} selected={form.promptAnswer === item} />
            ))}
          </View>
          <TextInput
            multiline
            onChangeText={(value) => updateForm("promptAnswer", value)}
            placeholder="Or write your own..."
            placeholderTextColor="#6B6B6B"
            style={[styles.input, styles.shortTextarea]}
            value={promptOptions.includes(form.promptAnswer) ? "" : form.promptAnswer}
          />
        </View>
      );
    }

    if (step === 8) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What are your interests?</Text>
          <Text style={styles.stepSubtitle}>Select up to 6 interests</Text>
          <View style={styles.cityWrap}>
            {allInterests.map((interest) => {
              const normalized = interest.toLowerCase();
              const isSelected = selectedInterests.includes(normalized);
              return (
                <Pressable
                  key={interest}
                  onPress={() => {
                    if (isSelected) {
                      updateForm(
                        "interests",
                        selectedInterests.filter((item) => item !== normalized).join(", "),
                      );
                    } else if (selectedInterests.length < 6) {
                      updateForm("interests", [...selectedInterests, normalized].join(", "));
                    }
                  }}
                  style={[styles.cityChip, isSelected ? styles.cityChipActive : null]}
                >
                  <Text style={[styles.cityChipText, isSelected ? styles.cityChipTextActive : null]}>{interest}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.counterText}>Selected: {selectedInterests.length}/6</Text>
        </View>
      );
    }

    if (step === 9) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Describe your lifestyle</Text>
          <Text style={styles.stepSubtitle}>Help others understand your daily life</Text>
          <View style={styles.stack}>
            {lifestyleOptions.map((item) => (
              <SelectChip key={item} label={item} onPress={() => updateForm("lifestyle", item)} selected={form.lifestyle === item} />
            ))}
          </View>
          <TextInput
            multiline
            onChangeText={(value) => updateForm("lifestyle", value)}
            placeholder="Or describe in your own words..."
            placeholderTextColor="#6B6B6B"
            style={[styles.input, styles.shortTextarea]}
            value={lifestyleOptions.includes(form.lifestyle) ? "" : form.lifestyle}
          />
        </View>
      );
    }

    if (step === 10) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>How would you describe your personality?</Text>
          <Text style={styles.stepSubtitle}>Let your true self shine</Text>
          <View style={styles.stack}>
            {personalityOptions.map((item) => (
              <SelectChip key={item} label={item} onPress={() => updateForm("personality", item)} selected={form.personality === item} />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Set your preferences</Text>
        <Text style={styles.stepSubtitle}>Find your ideal match</Text>

        <View style={styles.preferenceCard}>
          <View style={styles.preferenceLabelRow}>
            <SettingsIcon color="#E63946" size={18} />
            <Text style={styles.preferenceLabel}>Age Range</Text>
          </View>
          <View style={styles.rangeRow}>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateForm("minAge", value)} style={styles.rangeInput} value={form.minAge} />
            <Text style={styles.rangeText}>to</Text>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateForm("maxAge", value)} style={styles.rangeInput} value={form.maxAge} />
            <Text style={styles.rangeText}>years</Text>
          </View>
        </View>

        <View style={styles.preferenceCard}>
          <View style={styles.preferenceLabelRow}>
            <MapPinIcon color="#E63946" size={18} />
            <Text style={styles.preferenceLabel}>Distance</Text>
          </View>
          <View style={styles.rangeRow}>
            <TextInput keyboardType="number-pad" onChangeText={(value) => updateForm("radiusKm", value)} style={styles.rangeInputWide} value={form.radiusKm} />
            <Text style={styles.rangeText}>km</Text>
          </View>
        </View>

        <Text style={styles.preferenceHeading}>Dating Intent</Text>
        <View style={styles.stack}>
          {["Serious dating", "Casual dating", "Open to anything"].map((item) => (
            <SelectChip key={item} label={item} onPress={() => updateForm("intent", item)} selected={form.intent === item} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => setStep((current) => Math.max(0, current - 1))} style={[styles.backRoundButton, step === 0 ? styles.hiddenButton : null]}>
            <ChevronLeftIcon color="#1C1C1C" size={22} />
          </Pressable>
          <Text style={styles.stepCounter}>
            {step + 1} of {TOTAL_STEPS}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {loading ? <Text style={styles.loadingText}>Loading onboarding...</Text> : renderStep()}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        {[7, 8, 9, 10].includes(step) ? (
          <Pressable disabled={saving} onPress={() => void handleSkipOptional()}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <OnboardingButton label={saving ? (step === TOTAL_STEPS - 1 ? "Completing..." : "Saving...") : step === TOTAL_STEPS - 1 ? "Complete" : "Continue"} onPress={() => void handleContinue()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 62,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backRoundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenButton: {
    opacity: 0,
  },
  stepCounter: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  headerSpacer: {
    width: 40,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#ECECEC",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E63946",
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loadingText: {
    color: "#6B6B6B",
    fontSize: 14,
    marginTop: 12,
  },
  stepContent: {
    paddingTop: 12,
  },
  stepTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: "#1C1C1C",
  },
  stepSubtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B6B6B",
  },
  input: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    color: "#1C1C1C",
    fontSize: 16,
  },
  textarea: {
    minHeight: 112,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  shortTextarea: {
    minHeight: 84,
    paddingTop: 14,
    textAlignVertical: "top",
    marginTop: 16,
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ageChip: {
    width: "18%",
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  ageChipActive: {
    backgroundColor: "#E63946",
  },
  ageChipText: {
    color: "#1C1C1C",
    fontWeight: "600",
  },
  ageChipTextActive: {
    color: "#FFFFFF",
  },
  stack: {
    gap: 12,
  },
  optionChip: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  optionChipActive: {
    backgroundColor: "#E63946",
  },
  optionChipText: {
    flex: 1,
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "600",
  },
  optionChipTextActive: {
    color: "#FFFFFF",
  },
  iconInputWrap: {
    position: "relative",
  },
  iconInput: {
    position: "absolute",
    top: 18,
    left: 16,
    zIndex: 1,
  },
  inputWithIcon: {
    paddingLeft: 46,
  },
  cityWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  cityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F5F5F5",
  },
  cityChipActive: {
    backgroundColor: "#E63946",
  },
  cityChipText: {
    color: "#1C1C1C",
    fontSize: 14,
    fontWeight: "600",
  },
  cityChipTextActive: {
    color: "#FFFFFF",
  },
  heroPhoto: {
    width: 192,
    height: 256,
    borderRadius: 20,
    alignSelf: "center",
  },
  photoPlaceholder: {
    width: 192,
    height: 256,
    borderRadius: 20,
    alignSelf: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ECECEC",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    color: "#6B6B6B",
    fontSize: 14,
  },
  helperText: {
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
    color: "#6B6B6B",
    fontSize: 13,
  },
  samplePhotoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  samplePhoto: {
    width: 64,
    height: 80,
    borderRadius: 10,
  },
  samplePhotoActive: {
    borderWidth: 2,
    borderColor: "#E63946",
  },
  suggestionCard: {
    borderRadius: 14,
    backgroundColor: "#FFF5F4",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suggestionText: {
    color: "#E63946",
    fontSize: 14,
    lineHeight: 20,
  },
  counterText: {
    marginTop: 20,
    color: "#6B6B6B",
    fontSize: 14,
  },
  preferenceCard: {
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    padding: 16,
    marginBottom: 18,
  },
  preferenceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  preferenceLabel: {
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "700",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rangeInput: {
    width: 72,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    color: "#1C1C1C",
    fontWeight: "600",
  },
  rangeInputWide: {
    width: 96,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    color: "#1C1C1C",
    fontWeight: "600",
  },
  rangeText: {
    color: "#6B6B6B",
    fontSize: 14,
  },
  preferenceHeading: {
    marginBottom: 12,
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 12,
  },
  skipText: {
    textAlign: "center",
    color: "#6B6B6B",
    fontSize: 14,
    fontWeight: "600",
  },
  ctaButton: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 16,
    color: "#C1121F",
    fontSize: 13,
    lineHeight: 20,
  },
});

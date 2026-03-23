import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { OnboardingScaffold } from "../../src/features/onboarding/OnboardingScaffold";
import { StepHeader } from "../../src/features/onboarding/step-components";
import { onboardingStepStyles as styles } from "../../src/features/onboarding/step-styles";

const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
const months = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const years = Array.from({length: 100}, (_, i) => String(currentYear - 18 - i));

function CustomDropdown({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (val: string) => void }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.dobInputWrap}>
      <Text style={styles.dobInputLabel}>{label}</Text>
      <Pressable 
        style={[styles.dobInput, { justifyContent: 'center' }]} 
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: value ? "#1C1C1C" : "#9A9A9A", fontSize: 16 }}>{value || label}</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={localStyles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Select {label}</Text>
            <ScrollView style={localStyles.modalScroll}>
              {options.map((opt) => (
                <Pressable 
                  key={opt}
                  style={localStyles.modalItem}
                  onPress={() => {
                    onSelect(opt);
                    setVisible(false);
                  }}
                >
                  <Text style={[localStyles.modalItemText, value === opt && localStyles.modalItemTextActive]}>{opt}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function AgeScreen() {
  const { profile, updateProfile } = useAppFlow();
  const [day = "", month = "", year = ""] = profile.dateOfBirth.split("/");
  const birthDate = getValidatedBirthDate(day, month, year);
  const derivedAge = birthDate ? String(getAgeFromDate(birthDate)) : "";
  const isStepComplete = derivedAge.length > 0;

  function handleDobChange(part: "day" | "month" | "year", rawValue: string) {
    const nextDay = part === "day" ? rawValue : day;
    const nextMonth = part === "month" ? rawValue : month;
    const nextYear = part === "year" ? rawValue : year;
    const nextDate = [nextDay, nextMonth, nextYear].join("/");
    const nextBirthDate = getValidatedBirthDate(nextDay, nextMonth, nextYear);

    updateProfile("dateOfBirth", nextDate);
    updateProfile("age", nextBirthDate ? String(getAgeFromDate(nextBirthDate)) : "");
  }

  return (
    <OnboardingScaffold
      step={1}
      totalSteps={12}
      primaryDisabled={!isStepComplete}
      primaryLabel="Continue"
      onBack={() => router.replace("/(onboarding)/name")}
      onPrimary={() => router.replace("/(onboarding)/gender")}
    >
      <View style={styles.stepContent}>
        <StepHeader title="When's your birthday?" subtitle="We use your date of birth to calculate your age and keep your profile accurate." />

        <View style={styles.dobRow}>
          <CustomDropdown label="Day" value={day} options={days} onSelect={(val) => handleDobChange("day", val)} />
          <CustomDropdown label="Month" value={month} options={months} onSelect={(val) => handleDobChange("month", val)} />
          <CustomDropdown label="Year" value={year} options={years} onSelect={(val) => handleDobChange("year", val)} />
        </View>

        <Text style={styles.dobHint}>You need to be at least 18 to join Bold Club.</Text>

        <View style={styles.dobAgeCard}>
          <Text style={styles.dobAgeLabel}>Profile age</Text>
          <Text style={styles.dobAgeValue}>{derivedAge || "--"}</Text>
          <Text style={styles.dobAgeCaption}>{derivedAge ? "This is the age that will appear on your profile." : "Enter a valid date to preview the age shown on your profile."}</Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function getValidatedBirthDate(day: string, month: string, year: string) {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return null;
  }

  const numericDay = Number(day);
  const numericMonth = Number(month);
  const numericYear = Number(year);

  if (!numericDay || !numericMonth || !numericYear) {
    return null;
  }

  const candidate = new Date(numericYear, numericMonth - 1, numericDay);
  const isSameDate =
    candidate.getFullYear() === numericYear && candidate.getMonth() === numericMonth - 1 && candidate.getDate() === numericDay;

  if (!isSameDate) {
    return null;
  }

  const age = getAgeFromDate(candidate);
  if (age < 18 || age > 100) {
    return null;
  }

  return candidate;
}

function getAgeFromDate(date: Date) {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDifference = today.getMonth() - date.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '50%',
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: {
    fontSize: 18,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  modalItemTextActive: {
    color: '#E63946',
    fontWeight: '700',
  }
});

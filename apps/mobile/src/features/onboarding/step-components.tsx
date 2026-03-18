import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

import { CheckIcon } from "../../components/icons";
import { onboardingStepStyles as styles } from "./step-styles";

export function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.optionButton, selected ? styles.optionButtonActive : null]}>
      <Text style={[styles.optionLabel, selected ? styles.optionLabelActive : null]}>{label}</Text>
      {selected ? <CheckIcon color="#FFFFFF" size={16} /> : null}
    </Pressable>
  );
}

export function ChipButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipActive : null]}>
      <Text style={[styles.chipText, selected ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

export function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </>
  );
}

export function SimpleActionCard({ children }: { children: ReactNode }) {
  return children;
}

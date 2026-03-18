import type { ColorSchemeName } from "react-native";

type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceGlass: string;
  stroke: string;
  primary: string;
  secondary: string;
  tertiary: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
};

export type AppTheme = {
  isDark: boolean;
  colors: ThemeColors;
};

export function buildAppTheme(colorScheme: ColorSchemeName): AppTheme {
  const isDark = colorScheme === "dark";

  return {
    isDark,
    colors: {
      background: isDark ? "#0C0811" : "#FFF7FA",
      surface: isDark ? "#17121F" : "#FFFFFF",
      surfaceElevated: isDark ? "#221B2E" : "#FFF0F6",
      surfaceGlass: isDark ? "rgba(28, 20, 40, 0.74)" : "rgba(255, 255, 255, 0.72)",
      stroke: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(122, 74, 119, 0.12)",
      primary: "#FF4F7B",
      secondary: "#5E7DFF",
      tertiary: "#9A66FF",
      textPrimary: isDark ? "#FFF7FB" : "#241126",
      textSecondary: isDark ? "#D6C7DA" : "#6D5571",
      success: "#5AD7A0",
      warning: "#FFBC66",
    },
  };
}

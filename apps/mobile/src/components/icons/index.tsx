import { Ionicons } from "@expo/vector-icons";
import {
  Apple,
  Check,
  ChevronLeft,
  ChevronRight,
  Chrome,
  Compass,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  Sparkles,
  User,
} from "lucide-react-native";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function BrandHeartIcon({ size = 28, color = "#FFFFFF", strokeWidth = 2.5 }: IconProps) {
  return <Heart color={color} fill={color} size={size} strokeWidth={strokeWidth} />;
}

export function MailIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.2 }: IconProps) {
  return <Mail color={color} size={size} strokeWidth={strokeWidth} />;
}

export function PhoneIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.2 }: IconProps) {
  return <Phone color={color} size={size} strokeWidth={strokeWidth} />;
}

export function GoogleIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.2 }: IconProps) {
  return <Chrome color={color} size={size} strokeWidth={strokeWidth} />;
}

export function AppleIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.2 }: IconProps) {
  return <Apple color={color} size={size} strokeWidth={strokeWidth} />;
}

export function EyeIcon({ size = 18, color = "#7A6B72" }: IconProps) {
  return <Ionicons color={color} name="eye-outline" size={size} />;
}

export function EyeOffIcon({ size = 18, color = "#7A6B72" }: IconProps) {
  return <Ionicons color={color} name="eye-off-outline" size={size} />;
}

export function CheckIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.3 }: IconProps) {
  return <Check color={color} size={size} strokeWidth={strokeWidth} />;
}

export function ChevronLeftIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.3 }: IconProps) {
  return <ChevronLeft color={color} size={size} strokeWidth={strokeWidth} />;
}

export function ChevronRightIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.3 }: IconProps) {
  return <ChevronRight color={color} size={size} strokeWidth={strokeWidth} />;
}

export function MapPinIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.3 }: IconProps) {
  return <MapPin color={color} size={size} strokeWidth={strokeWidth} />;
}

export function SettingsIcon({ size = 18, color = "#1C1C1C", strokeWidth = 2.3 }: IconProps) {
  return <Settings color={color} size={size} strokeWidth={strokeWidth} />;
}

export function TabPersonalityIcon({ size = 20, color = "#6B6B6B", strokeWidth = 2.2 }: IconProps) {
  return <Sparkles color={color} size={size} strokeWidth={strokeWidth} />;
}

export function TabLikesIcon({ size = 20, color = "#6B6B6B", strokeWidth = 2.2 }: IconProps) {
  return <Heart color={color} fill={color === "#E63946" ? color : "none"} size={size} strokeWidth={strokeWidth} />;
}

export function TabDiscoverIcon({ size = 20, color = "#6B6B6B", strokeWidth = 2.2 }: IconProps) {
  return <Compass color={color} size={size} strokeWidth={strokeWidth} />;
}

export function TabChatIcon({ size = 20, color = "#6B6B6B", strokeWidth = 2.2 }: IconProps) {
  return <MessageCircle color={color} size={size} strokeWidth={strokeWidth} />;
}

export function TabProfileIcon({ size = 20, color = "#6B6B6B", strokeWidth = 2.2 }: IconProps) {
  return <User color={color} size={size} strokeWidth={strokeWidth} />;
}

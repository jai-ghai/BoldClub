import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

function FloatingOrb(props: {
  color: string;
  size: number;
  top: number;
  left: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-28, { duration: props.duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(16, { duration: props.duration, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: props.duration * 0.85, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.94, { duration: props.duration * 0.85, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [props.duration, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <AnimatedView
      style={[
        styles.orb,
        animatedStyle,
        {
          backgroundColor: props.color,
          width: props.size,
          height: props.size,
          top: props.top,
          left: props.left,
        },
      ]}
    />
  );
}

export function LiquidBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={["#130A17", "#2A1234", "#FFF0F7"] as const} style={StyleSheet.absoluteFill} />
      <FloatingOrb color="rgba(255, 79, 123, 0.26)" size={220} top={-18} left={-34} duration={4600} />
      <FloatingOrb color="rgba(94, 125, 255, 0.18)" size={260} top={180} left={188} duration={5200} />
      <FloatingOrb color="rgba(154, 102, 255, 0.18)" size={200} top={440} left={16} duration={6100} />
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.01)"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sheen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  sheen: {
    position: "absolute",
    top: 0,
    right: -80,
    width: 220,
    height: 220,
    borderBottomLeftRadius: 220,
    opacity: 0.65,
  },
});

import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface StackListIndicatorProps {
  isActive: boolean;
}

export function StackListIndicator({
  isActive,
}: StackListIndicatorProps): React.ReactNode {
  const backgroundColor = useThemeColor("background");
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(isActive ? 1.5 : 1);
  }, [isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.indicator,
        animatedStyle,
        { opacity: isActive ? 1 : 0.2, backgroundColor },
      ]}
    />
  );
}

export interface StackListIndicatorsProps {
  stackIds: string[];
  focussedStackId: string | null;
  style?: StyleProp<ViewStyle>;
}

export default function StackListIndicators({
  stackIds,
  focussedStackId,
  style: styleProp,
}: StackListIndicatorsProps): React.ReactNode {
  const style = React.useMemo(
    () => StyleSheet.flatten([styles.indicators, styleProp]),
    [styleProp],
  );

  return (
    <View style={style}>
      {stackIds.map((stackId) => (
        <StackListIndicator
          key={stackId}
          isActive={stackId === focussedStackId}
        />
      ))}
    </View>
  );
}

const indicatorSize = 10;

const styles = StyleSheet.create({
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    height: indicatorSize,
    width: indicatorSize,
    borderRadius: indicatorSize / 2,
    marginHorizontal: 5,
  },
});

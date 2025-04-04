import React from "react";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import IconSymbol from "@/components/ui/IconSymbol";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export default function Loader(props: {
  style?: StyleProp<ViewStyle>;
}): React.ReactNode {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, props.style]}>
      <Animated.View style={animatedStyle}>
        <IconSymbol name="sync" size={50} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

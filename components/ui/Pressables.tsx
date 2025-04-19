import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  Pressable as RNGPressable,
  PressableProps as RNGPressableProps,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ExternalPathString, useRouter } from "expo-router";
import useVibrate from "@/hooks/useVibrate";

export interface PressableProps
  extends Omit<RNGPressableProps, "style" | "onPress" | "onLongPress"> {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  vibrate?: boolean;
  href?: ExternalPathString;
}

export const Pressable = React.forwardRef(function Pressable(
  {
    style: styleProp,
    onPress: onPressProp,
    onLongPress: onLongPressProp,
    vibrate: shouldVibrate = false,
    href,
    ...props
  }: PressableProps,
  ref,
): React.ReactNode {
  const { vibrate } = useVibrate();
  const { navigate } = useRouter();

  const style = React.useMemo<RNGPressableProps["style"]>(
    () => StyleSheet.flatten([styles.pressable, styleProp]),
    [styleProp],
  );

  const onPress = React.useMemo(() => {
    if (!onPressProp && !href) return undefined;

    return () => {
      if (shouldVibrate) {
        vibrate?.("Pressable");
      }

      onPressProp?.();

      if (href) {
        navigate(href);
      }
    };
  }, [onPressProp, vibrate, shouldVibrate, href, navigate]);

  const onLongPress = React.useMemo(() => {
    if (!onLongPressProp) return undefined;

    return () => {
      if (shouldVibrate) {
        vibrate?.("Pressable");
      }

      onLongPressProp?.();
    };
  }, [onLongPressProp, vibrate, shouldVibrate]);

  return (
    <RNGPressable
      {...props}
      onPress={onPress}
      onLongPress={onLongPress}
      style={style}
    />
  );
});

export interface TouchableOpacityProps extends PressableProps {
  activeOpacity?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

function useTouchableActiveProps(
  onStateChange: (active: boolean) => void,
): PressableProps {
  const hoverActive = React.useRef(false);
  const pointerActive = React.useRef(false);
  const touchActive = React.useRef(false);
  const pressActive = React.useRef(false);

  return React.useMemo((): PressableProps => {
    function checkStateChange() {
      const isActive =
        hoverActive.current ||
        pointerActive.current ||
        touchActive.current ||
        pressActive.current;

      onStateChange(isActive);
    }

    const withActivate = (ref: React.MutableRefObject<boolean>) => () => {
      ref.current = true;

      checkStateChange();
    };

    const withDeactivate = (ref: React.MutableRefObject<boolean>) => () => {
      ref.current = false;

      checkStateChange();
    };

    return {
      onHoverIn: withActivate(hoverActive),
      onHoverOut: withDeactivate(hoverActive),
      onPressIn: withActivate(pressActive),
      onPressOut: withDeactivate(pressActive),
      onTouchStart: withActivate(touchActive),
      onTouchEnd: withDeactivate(touchActive),
      onPointerEnter: withActivate(pointerActive),
      onPointerLeave: withDeactivate(pointerActive),
      onTouchCancel: withDeactivate(touchActive),
    };
  }, [onStateChange]);
}

export const defaultActiveOpacity = 0.5;

export const TouchableOpacity = React.forwardRef(function TouchableOpacity(
  {
    activeOpacity = defaultActiveOpacity,
    style: styleProp,
    contentContainerStyle: contentContainerStyleProp,
    ...props
  }: TouchableOpacityProps,
  ref,
): React.ReactNode {
  const opacityAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnimation.value,
  }));

  const style = React.useMemo<TouchableOpacityProps["style"]>(
    () => [StyleSheet.flatten([styles.container, styleProp]), animatedStyle],
    [styleProp, animatedStyle],
  );

  const contentContainerStyle = React.useMemo<
    TouchableOpacityProps["contentContainerStyle"]
  >(
    () =>
      StyleSheet.flatten([styles.contentContainer, contentContainerStyleProp]),
    [contentContainerStyleProp],
  );

  const activeProps = useTouchableActiveProps(
    React.useCallback(
      (active) => {
        opacityAnimation.value = withTiming(active ? activeOpacity : 1, {
          duration: 200,
        });
      },
      [opacityAnimation, activeOpacity],
    ),
  );

  return (
    <Animated.View style={style}>
      <Pressable style={contentContainerStyle} {...props} {...activeProps} />
    </Animated.View>
  );
});

export interface TouchableScaleProps extends PressableProps {
  activeScale?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const defaultActiveScale = 1.05;

export const TouchableScale = React.forwardRef(function TouchableScale(
  {
    activeScale = defaultActiveScale,
    style: styleProp,
    contentContainerStyle: contentContainerStyleProp,
    ...props
  }: TouchableScaleProps,
  ref,
): React.ReactNode {
  const scaleAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scaleAnimation.value,
      },
    ],
  }));

  const style = React.useMemo<TouchableOpacityProps["style"]>(
    () => [StyleSheet.flatten([styles.container, styleProp]), animatedStyle],
    [styleProp, animatedStyle],
  );

  const contentContainerStyle = React.useMemo<
    TouchableOpacityProps["contentContainerStyle"]
  >(
    () =>
      StyleSheet.flatten([styles.contentContainer, contentContainerStyleProp]),
    [contentContainerStyleProp],
  );

  const activeProps = useTouchableActiveProps(
    React.useCallback(
      (active) => {
        scaleAnimation.value = withTiming(active ? activeScale : 1, {
          duration: 200,
        });
      },
      [scaleAnimation, activeScale],
    ),
  );

  return (
    <Animated.View style={style}>
      <Pressable style={contentContainerStyle} {...props} {...activeProps} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  pressable: {},
  container: {},
  contentContainer: {
    flex: 1,
    cursor: "pointer",
  },
});

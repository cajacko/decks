import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
} from "react-native";
import IconSymbol, { IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useOnPressProps } from "@/components/forms/Button";
import { useSkeletonAnimation } from "@/context/Skeleton";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Skeleton from "../ui/Skeleton";

export type { IconSymbolName };

export interface IconButtonProps extends TouchableOpacityProps {
  icon: IconSymbolName | { _children: React.ReactNode };
  style?: StyleProp<ViewStyle>;
  size?: number;
  variant?: "filled" | "transparent";
  vibrate?: boolean;
  loading?: boolean;
  skeleton?: boolean;
}

const defaultSize = 80;

export function IconButtonSkeleton({
  size = defaultSize,
  style,
}: Pick<IconButtonProps, "size" | "style">) {
  return (
    <Skeleton
      variant="button"
      shape="circle"
      height={size}
      width={size}
      style={style}
    />
  );
}

export default function IconButton({
  icon,
  style: styleProp,
  size = defaultSize,
  variant = "filled",
  loading = false,
  skeleton,
  ...props
}: IconButtonProps): React.ReactNode {
  const { background, text } = useThemeColors();
  const { color } = useSkeletonAnimation();

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        variant === "filled" && styles.filled,
        variant === "filled" && {
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
        styleProp,
      ]),
    [styleProp, size, background, variant],
  );

  const onPressProps = useOnPressProps(props);

  const skeletonStyle = useAnimatedStyle(() => ({
    backgroundColor: color.value,
  }));

  const children = React.useMemo((): React.ReactNode => {
    const iconSize = variant === "filled" ? size * 0.5 : size;

    if (skeleton) {
      return (
        <Animated.View
          style={[
            { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
            skeletonStyle,
          ]}
        />
      );
    }

    if (typeof icon === "string") {
      return <IconSymbol name={icon} color={text} size={iconSize} />;
    }

    return icon._children;
  }, [icon, size, text, variant, skeleton, skeletonStyle]);

  return (
    <TouchableOpacity {...props} {...onPressProps} style={style}>
      {children}
    </TouchableOpacity>
  );
}

const floatingButtonOffset = 20;

export function getFloatingButtonVerticalAllowance({
  size = defaultSize,
}: Pick<IconButtonProps, "size"> = {}): number {
  return size + floatingButtonOffset * 2;
}

export const styles = StyleSheet.create({
  filled: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  floating: {
    position: "absolute",
    bottom: floatingButtonOffset,
    right: floatingButtonOffset,
  },
});

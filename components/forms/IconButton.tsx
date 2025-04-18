import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import IconSymbol, { IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSkeletonAnimation } from "@/context/Skeleton";
import Animated from "react-native-reanimated";
import Skeleton from "../ui/Skeleton";
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from "@/components/ui/Pressables";

export type { IconSymbolName };

export interface IconButtonProps extends TouchableOpacityProps {
  icon: IconSymbolName | { _children: React.ReactNode };
  style?: StyleProp<ViewStyle>;
  size?: number;
  variant?: "filled" | "transparent";
  vibrate?: boolean;
  loading?: boolean;
  skeleton?: boolean;
  disabled?: boolean;
  iconRotation?: number;
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
  disabled = false,
  iconRotation,
  contentContainerStyle: contentContainerStyleProp,
  ...props
}: IconButtonProps): React.ReactNode {
  const { background, text: _text, textDisabled } = useThemeColors();
  const { backgroundColorStyle } = useSkeletonAnimation() ?? {};
  const iconColor = disabled ? textDisabled : _text;

  const { style, contentContainerStyle } = React.useMemo(() => {
    return {
      style: StyleSheet.flatten([
        {
          height: size,
          width: size,
        },
        styleProp,
      ]),
      contentContainerStyle: StyleSheet.flatten([
        {
          height: size,
          width: size,
        },
        variant === "filled" && styles.filled,
        variant === "filled" && {
          borderRadius: size / 2,
          backgroundColor: background,
          borderColor: iconColor,
        },
        styles.contentContainer,
        contentContainerStyleProp,
      ]),
    };
  }, [
    size,
    background,
    variant,
    iconColor,
    styleProp,
    contentContainerStyleProp,
  ]);

  const children = React.useMemo((): React.ReactNode => {
    const iconSize = variant === "filled" ? size * 0.5 : size;

    if (skeleton) {
      return (
        <Animated.View
          style={[
            { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
            backgroundColorStyle,
          ]}
        />
      );
    }

    if (typeof icon === "string") {
      // NOTE: ios doesn't like us rotating the actual icon syymbol
      return (
        <IconSymbol
          name={icon}
          color={iconColor}
          size={iconSize}
          rotation={iconRotation}
        />
      );
    }

    return icon._children;
  }, [
    icon,
    size,
    iconColor,
    variant,
    skeleton,
    backgroundColorStyle,
    iconRotation,
  ]);

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={disabled ? 1 : props.activeOpacity}
      style={style}
      contentContainerStyle={contentContainerStyle}
    >
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filled: {
    overflow: "hidden",
    borderWidth: 1,
  },
  floating: {
    position: "absolute",
    bottom: floatingButtonOffset,
    right: floatingButtonOffset,
  },
});

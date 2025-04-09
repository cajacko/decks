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
import Animated from "react-native-reanimated";
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
  ...props
}: IconButtonProps): React.ReactNode {
  const { background, text: _text, textDisabled } = useThemeColors();
  const { backgroundColorStyle } = useSkeletonAnimation();
  const iconColor = disabled ? textDisabled : _text;

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        variant === "filled" && styles.filled,
        variant === "filled" && {
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: background,
          borderColor: iconColor,
        },
        styleProp,
      ]),
    [styleProp, size, background, variant, iconColor],
  );

  const onPressProps = useOnPressProps(props);

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
      return (
        <IconSymbol
          name={icon}
          color={iconColor}
          size={iconSize}
          style={{
            transform: iconRotation
              ? [
                  {
                    rotate: `${iconRotation}deg`,
                  },
                ]
              : undefined,
          }}
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
      {...onPressProps}
      activeOpacity={disabled ? 1 : props.activeOpacity}
      style={style}
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
  filled: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
  floating: {
    position: "absolute",
    bottom: floatingButtonOffset,
    right: floatingButtonOffset,
  },
});

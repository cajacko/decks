import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import IconButton, { IconSymbolName } from "./IconButton";

export interface CardActionProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  active?: boolean;
  vibrate?: boolean;
}

export const cardActionSize = 60;
export const defaultOpacity = 0.5;

export default function CardAction({
  icon,
  style,
  onPress,
  active,
  vibrate: shouldVibrate = false,
}: CardActionProps): React.ReactNode {
  const contentContainerStyle = React.useMemo(
    () => ({
      opacity: active ? 1 : defaultOpacity,
    }),
    [active],
  );

  return (
    <IconButton
      onPress={onPress}
      style={style}
      variant="filled"
      size={cardActionSize}
      icon={icon}
      vibrate={shouldVibrate}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

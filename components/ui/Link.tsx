import React from "react";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Link as ERLink, LinkProps as ERLinkProps } from "expo-router";
import useVibrate from "@/hooks/useVibrate";

export interface LinkProps extends ERLinkProps, Pick<ThemedTextProps, "type"> {
  text?: string;
  ThemedTextProps?: Partial<ThemedTextProps>;
  TouchableProps?: Partial<TouchableOpacityProps>;
  vibrate?: boolean;
}

export type Href = LinkProps["href"];

export default function Link({
  text: textProp,
  type = "link",
  ThemedTextProps,
  TouchableProps,
  children: childrenProp,
  vibrate: shouldVibrate = false,
  ...props
}: LinkProps): React.ReactNode {
  const childrenText =
    typeof childrenProp === "string" ? childrenProp : undefined;
  const text = textProp || childrenText;

  const { vibrate } = useVibrate();
  const touchableOnPress = TouchableProps?.onPress;

  const onPress = React.useCallback<
    NonNullable<TouchableOpacityProps["onPress"]>
  >(
    (event) => {
      if (shouldVibrate) {
        vibrate?.("Link");
      }

      touchableOnPress?.(event);
    },
    [shouldVibrate, vibrate, touchableOnPress],
  );

  const children = text ? (
    <ThemedText type={type} {...ThemedTextProps}>
      {text}
    </ThemedText>
  ) : (
    <TouchableOpacity {...TouchableProps} onPress={onPress}>
      {childrenProp}
    </TouchableOpacity>
  );

  return (
    <ERLink asChild={!text} {...props}>
      {children}
    </ERLink>
  );
}

import React from "react";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { Link as ERLink, LinkProps as ERLinkProps } from "expo-router";
import useVibrate from "@/hooks/useVibrate";

export interface LinkProps
  extends Omit<ERLinkProps, "children">,
    Pick<ThemedTextProps, "type"> {
  text?: string;
  ThemedTextProps?: Partial<ThemedTextProps>;
  vibrate?: boolean;
  onPress?: () => void;
  children?: string;
}

export type Href = LinkProps["href"];

export default function Link({
  text: textProp,
  type = "link",
  ThemedTextProps,
  onPress: onPressProp,
  vibrate: shouldVibrate = false,
  href,
  children,
  ...props
}: LinkProps): React.ReactNode {
  const { vibrate } = useVibrate();
  const text = textProp ?? children;

  const onPress = React.useCallback<NonNullable<LinkProps["onPress"]>>(() => {
    if (shouldVibrate) {
      vibrate?.("Link");
    }

    onPressProp?.();
  }, [shouldVibrate, vibrate, onPressProp]);

  return (
    <ERLink href={href} {...props} onPress={onPress}>
      <ThemedText type={type} {...ThemedTextProps}>
        {text}
      </ThemedText>
    </ERLink>
  );
}

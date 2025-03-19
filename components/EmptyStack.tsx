import React from "react";
import { StyleSheet } from "react-native";
import Button from "./Button";
import { defaultOpacity } from "./CardAction";
import { useThemeColor } from "@/hooks/useThemeColor";
import CardContainer, {
  CardContainerProps,
} from "@/components/cards/connected/CardContainer";

export type EmptyStackProps = {
  style?: CardContainerProps["style"];
  buttonTitle?: string;
  buttonAction?: () => void;
};

export default function EmptyStack({
  style,
  buttonAction,
  buttonTitle,
}: EmptyStackProps): React.ReactNode {
  const borderColor = useThemeColor("emptyStackBorder");

  return (
    <CardContainer
      style={StyleSheet.flatten([styles.container, { borderColor }, style])}
      shadow={false}
    >
      {buttonAction && buttonTitle && (
        <Button
          style={styles.action}
          title={buttonTitle}
          onPress={buttonAction}
        />
      )}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 2,
    borderStyle: "dashed",
    margin: 2,
    // Slightly smaller so it doesn't poke out of the cards when in a stack
    transform: [{ scale: 0.95 }],
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
  action: {
    marginTop: 20,
    opacity: defaultOpacity,
  },
});

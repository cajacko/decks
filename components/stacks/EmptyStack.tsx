import React from "react";
import { StyleSheet } from "react-native";
import Button from "@/components/forms/Button";
import { defaultOpacity } from "@/components/forms/CardAction";
import { useThemeColor } from "@/hooks/useThemeColor";
import CardContainer, {
  CardContainerProps,
} from "@/components/cards/connected/CardContainer";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import { Target } from "@/utils/cardTarget";

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
  const { deckId } = useTabletopContext();
  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  return (
    <CardContainer
      style={StyleSheet.flatten([styles.container, { borderColor }, style])}
      shadow={false}
      target={target}
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
    opacity: defaultOpacity,
  },
});

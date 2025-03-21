import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Card from "./cards/connected/Card";
import { Target } from "@/utils/cardTarget";
import ThemedText from "./ThemedText";
import { useEditCardModal } from "./EditCardModal";
import text from "@/constants/text";

export interface DeckDefaultsProps {
  deckId: string;
  style?: StyleProp<ViewStyle>;
}

export default function DeckDefaults(
  props: DeckDefaultsProps,
): React.ReactNode {
  const deckDefaultTarget = React.useMemo(
    (): Target => ({ id: props.deckId, type: "deck-defaults" }),
    [props.deckId],
  );

  const { component, open } = useEditCardModal(deckDefaultTarget);

  return (
    <>
      {component}
      <View style={props.style}>
        <ThemedText type="h2">
          {text["deck_screen.deck_defaults.title"]}
        </ThemedText>
        <ThemedText style={styles.description}>
          {text["deck_screen.deck_defaults.description"]}
        </ThemedText>
        <View style={styles.sides}>
          <Pressable
            onPress={() => open(deckDefaultTarget, { initialSide: "front" })}
            style={styles.side}
          >
            <Card target={deckDefaultTarget} side="front" />
            <ThemedText style={styles.sideText} type="h4">
              {text["deck_screen.deck_defaults.front"]}
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => open(deckDefaultTarget, { initialSide: "back" })}
            style={styles.side}
          >
            <Card target={deckDefaultTarget} side="back" />
            <ThemedText style={styles.sideText} type="h4">
              {text["deck_screen.deck_defaults.back"]}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sides: {
    flexDirection: "row",
    marginTop: 30,
  },
  description: {
    marginTop: 10,
  },
  side: {
    flex: 1,
    alignItems: "center",
  },
  sideText: {
    marginTop: 10,
  },
});

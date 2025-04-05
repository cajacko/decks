import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Card from "@/components/cards/connected/Card";
import CardSkeleton from "@/components/cards/connected/CardSkeleton";
import { Target } from "@/utils/cardTarget";
import ThemedText from "../ui/ThemedText";
import { useEditCardModal } from "../editCard/EditCardModal";
import text from "@/constants/text";
import Skeleton from "../ui/Skeleton";

export interface DeckDefaultsProps {
  deckId: string;
  style?: StyleProp<ViewStyle>;
}

function DeckDefaultsContent(
  props: Pick<DeckDefaultsProps, "style"> & {
    titles?: React.ReactNode;
    front: React.ReactNode;
    back: React.ReactNode;
    onPressFront?: () => void;
    onPressBack?: () => void;
  },
) {
  return (
    <>
      <View style={props.style}>
        {props.titles}
        <View style={styles.sides}>
          {props.onPressFront ? (
            <Pressable onPress={props.onPressFront} style={styles.side}>
              {props.front}
            </Pressable>
          ) : (
            <View style={styles.side}>{props.front}</View>
          )}

          {props.onPressBack ? (
            <Pressable onPress={props.onPressBack} style={styles.side}>
              {props.back}
            </Pressable>
          ) : (
            <View style={styles.side}>{props.back}</View>
          )}
        </View>
      </View>
    </>
  );
}

export function DeckDefaultsSkeleton({
  style,
}: Pick<DeckDefaultsProps, "style">) {
  const side = (
    <>
      <CardSkeleton />
      <Skeleton variant="text" width={80} style={styles.sideText} />
    </>
  );

  return <DeckDefaultsContent style={style} back={side} front={side} />;
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
      <DeckDefaultsContent
        style={props.style}
        onPressFront={() => open(deckDefaultTarget, { initialSide: "front" })}
        onPressBack={() => open(deckDefaultTarget, { initialSide: "back" })}
        titles={
          <>
            <ThemedText type="h2">
              {text["deck_screen.deck_defaults.title"]}
            </ThemedText>
            <ThemedText style={styles.description}>
              {text["deck_screen.deck_defaults.description"]}
            </ThemedText>
          </>
        }
        front={
          <>
            <Card target={deckDefaultTarget} side="front" />
            <ThemedText style={styles.sideText} type="h4">
              {text["deck_screen.deck_defaults.front"]}
            </ThemedText>
          </>
        }
        back={
          <>
            <Card target={deckDefaultTarget} side="back" />
            <ThemedText style={styles.sideText} type="h4">
              {text["deck_screen.deck_defaults.back"]}
            </ThemedText>
          </>
        }
      />
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

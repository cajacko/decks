import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectVisibleCardInstances } from "@/store/slices/stacks";
import CardInstance from "./CardInstance";

export interface StackProps {
  stackId: string;
}

export default function Stack({ stackId }: StackProps): React.ReactNode {
  const cardInstances = useAppSelector((state) =>
    selectVisibleCardInstances(state, { stackId })
  );

  return (
    <View style={styles.container}>
      {cardInstances?.map(({ cardId, cardInstanceId, state }, i) => (
        <CardInstance
          key={cardInstanceId}
          cardId={cardId}
          state={state}
          // TODO: would be good to maintain the rotation angles when moving cards around
          // Prob store this in local component state?
          // Also handle any number of rendered items, not just 3
          style={[
            styles.card,
            i === 0
              ? styles.topCard
              : i === 1
              ? styles.secondCard
              : styles.thirdCard,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  card: {},
  topCard: {
    position: "relative",
    zIndex: 3,
  },
  // TODO: Darken cards behind the front? Potential render a black translucent card over the top of
  // each?
  secondCard: {
    position: "absolute",
    top: -2,
    left: 2,
    transform: [{ rotate: "3deg" }],
    zIndex: 2,
  },
  thirdCard: {
    position: "absolute",
    top: 2,
    left: -2,
    transform: [{ rotate: "-3deg" }],
    zIndex: 1,
  },
});

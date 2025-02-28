import React from "react";
import CardAction from "./CardAction";
import {
  undo,
  selectTabletopHasPast,
  selectTabletopHasFuture,
  redo,
} from "@/store/slices/tabletop";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet, View } from "react-native";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function TabletopToolbar(): React.ReactNode {
  const { tabletopId } = useTabletopContext();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, { tabletopId }),
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, { tabletopId }),
  );

  const deckId = typeof params.deckId === "string" ? params.deckId : null;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CardAction
        icon="Undo"
        onPress={hasPast ? () => dispatch(undo({ tabletopId })) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasPast ? 1 : 0.5 },
        ])}
      />
      <CardAction
        icon="Reset"
        onPress={() => dispatch(resetTabletopHelper({ tabletopId }))}
        style={styles.action}
      />
      {deckId && (
        <CardAction
          icon="Deck"
          onPress={() => router.push(`/deck/${deckId}`)}
          style={styles.action}
        />
      )}
      {deckId && (
        <CardAction
          icon="+"
          onPress={() => router.push(`/deck/${deckId}/new-card`)}
          style={styles.action}
        />
      )}
      <CardAction
        icon="Redo"
        onPress={hasFuture ? () => dispatch(redo({ tabletopId })) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasFuture ? 1 : 0.5 },
        ])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "grey",
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
  },
  action: {},
});

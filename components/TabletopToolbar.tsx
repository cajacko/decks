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
import useDeleteWarning from "@/hooks/useDeleteWarning";
import EditCardModal from "./EditCardModal";
import { Target } from "@/utils/cardTarget";

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

  const { component, open } = useDeleteWarning({
    handleDelete: () => {
      dispatch(resetTabletopHelper({ tabletopId }));
    },
    title: "Reset Play Area",
    message:
      "This will move all cards back into the first stack and deck order",
    deleteButtonText: "Reset",
  });

  const deckId = typeof params.deckId === "string" ? params.deckId : null;
  const router = useRouter();

  const [editCardTarget, setEditCardTarget] = React.useState(
    (): Target | null =>
      deckId ? { type: "new-card-in-deck", id: deckId } : null,
  );

  const [showEditCard, setShowEditCard] = React.useState(false);

  const closeEditCard = React.useCallback(() => setShowEditCard(false), []);
  const openEditCard = React.useCallback(() => {
    setShowEditCard(true);
    setEditCardTarget(deckId ? { type: "new-card-in-deck", id: deckId } : null);
  }, [deckId]);

  return (
    <View style={styles.container}>
      {component}
      <CardAction
        icon="Undo"
        onPress={hasPast ? () => dispatch(undo({ tabletopId })) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasPast ? 1 : 0.5 },
        ])}
      />
      <CardAction icon="Reset" onPress={open} style={styles.action} />
      {deckId && (
        <CardAction
          icon="Deck"
          onPress={() => router.navigate(`/deck/${deckId}`)}
          style={styles.action}
        />
      )}
      {deckId && editCardTarget && (
        <>
          <EditCardModal
            visible={showEditCard}
            onRequestClose={closeEditCard}
            target={editCardTarget}
            onChangeTarget={setEditCardTarget}
            onDelete={closeEditCard}
          />
          <CardAction icon="+" onPress={openEditCard} style={styles.action} />
        </>
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

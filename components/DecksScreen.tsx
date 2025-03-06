import React from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import { useAppDispatch } from "@/store/hooks";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import { useDecksToolbarProps } from "@/components/DecksToolbar";
import MyDecks from "./MyDecks";

export interface DecksScreenProps {
  style?: ViewStyle;
}

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  useDecksToolbarProps();

  const createDeck = React.useCallback(() => {
    const deckId = uuid();

    dispatch(createDeckHelper({ deckId }));

    navigate(`/deck/${deckId}`);
  }, [navigate, dispatch]);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <View style={containerStyle}>
      <MyDecks style={styles.myDecks} />
      <IconButton icon="add" onPress={createDeck} style={styles.action} />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  myDecks: {
    marginTop: 20,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

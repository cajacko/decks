import React from "react";
import { StyleSheet, ViewStyle, ScrollView } from "react-native";
import { useAppDispatch } from "@/store/hooks";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import DecksToolbar from "@/components/DecksToolbar";
import MyDecks from "@/components/MyDecks";
import PreBuiltDecks from "@/components/PreBuiltDecks";

export interface DecksScreenProps {
  style?: ViewStyle;
}

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

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
    <>
      <DecksToolbar />
      <ScrollView style={containerStyle}>
        <MyDecks style={styles.myDecks} />
        <PreBuiltDecks style={styles.preBuiltDecks} />
      </ScrollView>
      <IconButton icon="add" onPress={createDeck} style={styles.action} />
    </>
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
  preBuiltDecks: {
    marginTop: 20,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

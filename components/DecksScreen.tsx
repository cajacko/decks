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
import useDeviceSize from "@/hooks/useDeviceSize";
import { CardConstraintsProvider } from "./cards/context/CardSizeConstraints";

const minCardListWidth = 100;
const maxCardListWidth = 150;

function useCardListWidth(): number {
  const { width } = useDeviceSize({ listenTo: { width: true, height: false } });

  const idealWidth = width / 3;

  if (idealWidth > maxCardListWidth) {
    return maxCardListWidth;
  }

  if (idealWidth < minCardListWidth) {
    return minCardListWidth;
  }

  return idealWidth;
}

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

  const cardWidth = useCardListWidth();

  return (
    <CardConstraintsProvider width={cardWidth}>
      <DecksToolbar />
      <ScrollView style={containerStyle}>
        <MyDecks style={styles.myDecks} />
        <PreBuiltDecks style={styles.preBuiltDecks} />
      </ScrollView>
      <IconButton icon="add" onPress={createDeck} style={styles.action} />
    </CardConstraintsProvider>
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

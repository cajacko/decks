import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import IconButton, {
  getFloatingButtonVerticalAllowance,
  styles as iconButtonStyles,
} from "../forms/IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import MyDecks from "@/components/decks/MyDecks";
import PreBuiltDecks, {
  PreBuiltDecksSkeleton,
} from "@/components/decks/PreBuiltDecks";
import useDeviceSize from "@/hooks/useDeviceSize";
import { CardConstraintsProvider } from "../cards/context/CardSizeConstraints";
import { Toolbar } from "@/context/Toolbar";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import { selectHasOwnDecks } from "@/store/selectors/decks";
import { ScrollView } from "react-native-gesture-handler";

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

function DecksScreenContent({
  style,
  button,
  myDecks,
  preBuiltDecks,
}: DecksScreenProps & {
  myDecks?: React.ReactNode;
  preBuiltDecks: React.ReactNode;
  button?: React.ReactNode;
}) {
  const containerStyle = React.useMemo(
    () => [styles.container, style],
    [style],
  );

  return (
    <>
      <ScrollView
        style={containerStyle}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {myDecks}
        {preBuiltDecks}
      </ScrollView>
      {button}
    </>
  );
}

function ConnectedDecksScreen(props: DecksScreenProps) {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const hasOwnDecks = useAppSelector(selectHasOwnDecks);

  const createDeck = React.useCallback(() => {
    const deckId = uuid();

    dispatch(createDeckHelper({ deckId }));

    navigate(`/deck/${deckId}`);
  }, [navigate, dispatch]);

  return (
    <DecksScreenContent
      style={props.style}
      myDecks={hasOwnDecks ? <MyDecks style={styles.myDecks} /> : undefined}
      preBuiltDecks={
        <PreBuiltDecks hideTitle={!hasOwnDecks} style={styles.preBuiltDecks} />
      }
      button={
        <IconButton
          icon="add"
          onPress={createDeck}
          style={iconButtonStyles.floating}
          vibrate
        />
      }
    />
  );
}

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const skeleton = useScreenSkeleton(DecksScreen.name);
  const cardWidth = useCardListWidth();

  const skeletonContent =
    skeleton === "show-nothing" ? null : (
      <DecksScreenContent
        style={props.style}
        preBuiltDecks={<PreBuiltDecksSkeleton style={styles.preBuiltDecks} />}
      />
    );

  return (
    <>
      <Toolbar loading={!!skeleton} />
      <CardConstraintsProvider width={cardWidth}>
        {skeleton ? skeletonContent : <ConnectedDecksScreen {...props} />}
      </CardConstraintsProvider>
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
  contentContainerStyle: {
    paddingTop: 20,
    paddingBottom: getFloatingButtonVerticalAllowance(),
  },
  myDecks: {
    marginTop: 20,
  },
  preBuiltDecks: {
    marginTop: 20,
  },
});

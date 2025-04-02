import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import text from "@/constants/text";
import Button from "../forms/Button";
import { selectCanEditDeck } from "@/store/slices/decks";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import { Toolbar, styles } from "@/context/Toolbar";
import useDeckName from "@/hooks/useDeckName";
import { appHome } from "@/constants/links";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";

interface DeckToolbarProps {
  deckId: string;
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const { entering, exiting } = useLayoutAnimations();

  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, props),
  );

  const copyDeck = React.useCallback(() => {
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId: props.deckId, newDeckId }));

    navigate(`/deck/${newDeckId}`);
  }, [props.deckId, dispatch, navigate]);

  const title = useDeckName(props.deckId);

  return (
    <Toolbar backPath={appHome} logoVisible={false} title={title}>
      {!canEditDeck && (
        <Animated.View entering={entering} exiting={exiting}>
          <Button
            title={text["deck.copy.title"]}
            variant="transparent"
            style={styles.action}
            vibrate
            onPress={copyDeck}
          />
        </Animated.View>
      )}
    </Toolbar>
  );
}

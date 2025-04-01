import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import text from "@/constants/text";
import Button from "../forms/Button";
import { selectCanEditDeck } from "@/store/slices/decks";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import Toolbar, { styles, useOnPressProps } from "../ui/Toolbar";

interface DeckToolbarProps {
  deckId: string;
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, props),
  );

  const copyDeck = React.useCallback(() => {
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId: props.deckId, newDeckId }));

    navigate(`/deck/${newDeckId}`);
  }, [props.deckId, dispatch, navigate]);

  const copyDeckProps = useOnPressProps(copyDeck);

  return (
    <Toolbar useParent>
      {!canEditDeck && (
        <Button
          title={text["deck.copy.title"]}
          variant="transparent"
          style={styles.action}
          vibrate
          {...copyDeckProps}
        />
      )}
    </Toolbar>
  );
}

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEditCardModal } from "./EditCardModal";
import text from "@/constants/text";
import Button from "./Button";
import { selectCanEditDeck } from "@/store/slices/decks";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import Toolbar, { styles, useOnPressProps } from "./Toolbar";
import { useSetDrawerProps } from "@/context/Drawer";

interface DeckToolbarProps {
  deckId: string;
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  useSetDrawerProps(props);
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const defaultCard = useEditCardModal({
    type: "deck-defaults",
    id: props.deckId,
  });

  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, props),
  );

  const copyDeck = React.useCallback(() => {
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId: props.deckId, newDeckId }));

    navigate(`/deck/${newDeckId}`);
  }, [props.deckId, dispatch, navigate]);

  const open = React.useCallback(() => {
    defaultCard.open();
  }, [defaultCard]);

  const openProps = useOnPressProps(open);
  const copyDeckProps = useOnPressProps(copyDeck);

  return (
    <Toolbar useParent>
      {canEditDeck ? (
        <>
          {defaultCard.component}
          <Button
            style={styles.action}
            title={text["deck.actions.default"]}
            variant="transparent"
            vibrate
            {...openProps}
          />
        </>
      ) : (
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

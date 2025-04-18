import React from "react";
import Alert, { AlertButton } from "@/components/overlays/Alert";
import text from "@/constants/text";
import uuid from "@/utils/uuid";
import { useAppDispatch } from "@/store/hooks";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import { useNavigation } from "@/context/Navigation";

export interface UseCopyToEditAlert {
  deckId: string;
}

export default function useCopyToEditAlert({ deckId }: UseCopyToEditAlert) {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  const [showAlert, setShowAlert] = React.useState(false);

  const copyDeck = React.useCallback(() => {
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId, newDeckId }));

    navigate({
      name: "deck",
      deckId: newDeckId,
    });
  }, [deckId, dispatch, navigate]);

  const open = React.useCallback(() => {
    setShowAlert(true);
  }, []);

  const close = React.useCallback(() => {
    setShowAlert(false);
  }, []);

  const buttons = React.useMemo<AlertButton[]>(
    () => [
      { text: text["general.cancel"], onPress: close, style: "cancel" },
      {
        text: text["deck.copy_alert.button"],
        onPress: () => {
          copyDeck();
          close();
        },
        style: "default",
      },
    ],
    [close, copyDeck],
  );

  return {
    copyDeck,
    open,
    close,
    visible: showAlert,
    component: (
      <Alert
        visible={showAlert}
        onRequestClose={close}
        title={text["deck.copy.title"]}
        message={text["deck.copy_alert.message"]}
        buttons={buttons}
      />
    ),
  };
}

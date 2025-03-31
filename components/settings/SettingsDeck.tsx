import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, { FieldSetProps } from "../forms/FieldSet";
import text from "@/constants/text";
import Button from "@/components/forms/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { copyDeckHelper, deleteDeckHelper } from "@/store/actionHelpers/decks";
import { useRouter } from "expo-router";
import { selectCanEditDeck, selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import uuid from "@/utils/uuid";
import { useDrawer } from "@/context/Drawer";

const titleProps = { type: "h2" } as const;

export interface SettingsDeckProps extends FieldSetProps {
  deckId: string;
}

export default function SettingsDeck({
  deckId,
  ...props
}: SettingsDeckProps): React.ReactNode {
  const { close: closeDrawer } = useDrawer() ?? {};
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );

  const deleteDeck = React.useCallback(() => {
    closeDrawer?.();
    navigate("/");

    dispatch(deleteDeckHelper({ deckId }));
  }, [deckId, dispatch, navigate, closeDrawer]);

  const deleteDeckModal = useDeleteWarning({
    handleDelete: deleteDeck,
    title: text["deck.delete.title"],
    message: text["deck.delete.message"],
  });

  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId }),
  );

  const copyDeck = React.useCallback(() => {
    closeDrawer?.();
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId, newDeckId }));

    navigate(`/deck/${newDeckId}`);
  }, [deckId, dispatch, navigate, closeDrawer]);

  return (
    <>
      {deleteDeckModal.component}
      <FieldSet
        title={text["settings.deck.title"]}
        titleProps={titleProps}
        subTitle={`(${deckName})`}
        initialCollapsed
        collapsible
        {...props}
      >
        <Button
          title={text["deck.copy.title"]}
          onPress={copyDeck}
          variant="outline"
          vibrate
        />
        {canEditDeck && (
          <Button
            title={text["deck.delete.title"]}
            onPress={deleteDeckModal.open}
            variant="outline"
          />
        )}
      </FieldSet>
    </>
  );
}

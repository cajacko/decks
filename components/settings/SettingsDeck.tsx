import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, {
  FieldSetProps,
  useLeftAdornmentSize,
} from "../forms/FieldSet";
import text from "@/constants/text";
import Button from "@/components/forms/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { copyDeckHelper, deleteDeckHelper } from "@/store/actionHelpers/decks";
import { useNavigation } from "@/context/Navigation";
import { selectCanEditDeck, selectDeck } from "@/store/selectors/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import uuid from "@/utils/uuid";
import IconSymbol from "../ui/IconSymbol";

const titleProps = { type: "h2" } as const;

export interface SettingsDeckProps extends FieldSetProps {
  deckId: string;
  closeDrawer: () => void;
}

export default function SettingsDeck({
  deckId,
  closeDrawer,
  ...props
}: SettingsDeckProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );

  const deleteDeck = React.useCallback(() => {
    closeDrawer?.();
    navigate({
      name: "decks",
    });

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

    navigate({
      name: "deck",
      deckId: newDeckId,
    });
  }, [deckId, dispatch, navigate, closeDrawer]);

  const iconSize = useLeftAdornmentSize({ titleProps });

  return (
    <>
      {deleteDeckModal.component}
      <FieldSet
        title={text["settings.deck.title"]}
        titleProps={titleProps}
        subTitle={`(${deckName})`}
        initialCollapsed
        collapsible
        leftAdornment={<IconSymbol name="crop-portrait" size={iconSize} />}
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

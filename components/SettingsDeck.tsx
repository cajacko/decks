import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, { FieldSetProps } from "./FieldSet";
import text from "@/constants/text";
import Button from "@/components/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import { useRouter } from "expo-router";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";

const titleProps = { type: "h2" } as const;

export interface SettingsDeckProps extends FieldSetProps {
  deckId: string;
}

export default function SettingsDeck({
  deckId,
  ...props
}: SettingsDeckProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );

  const deleteDeck = React.useCallback(() => {
    navigate("/");

    dispatch(deleteDeckHelper({ deckId }));
  }, [deckId, dispatch, navigate]);

  const deleteDeckModal = useDeleteWarning({
    handleDelete: deleteDeck,
    title: text["deck.delete.title"],
    message: text["deck.delete.message"],
  });

  return (
    <>
      {deleteDeckModal.component}
      <FieldSet
        title={text["settings.deck.title"]}
        titleProps={titleProps}
        subTitle={`(${deckName})`}
        {...props}
      >
        <Button
          title={text["deck.delete.title"]}
          onPress={deleteDeckModal.open}
          variant="outline"
        />
      </FieldSet>
    </>
  );
}

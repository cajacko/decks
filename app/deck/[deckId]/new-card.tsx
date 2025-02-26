import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";

export default function DeckNewCardScene() {
  const { deckId } = useLocalSearchParams();

  const [cardId, setCardId] = React.useState<string | undefined>(undefined);

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckNewCardScene.name}: deckId must be a string`);
  }

  return (
    <EditCard
      id={cardId ?? deckId}
      type={cardId ? "card" : "new-card-in-deck"}
      onCreateCard={setCardId}
    />
  );
}

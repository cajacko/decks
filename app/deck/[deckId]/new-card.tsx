import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";

export default function DeckNewCardScene() {
  const { deckId } = useLocalSearchParams();

  const [cardId, setCardId] = React.useState<string | undefined>(undefined);

  if (typeof deckId !== "string") {
    throw new Error("deckId must be a string");
  }

  return (
    <EditCard
      targetId={cardId ?? deckId}
      targetType={cardId ? "card" : "deck"}
      onCreateCard={setCardId}
    />
  );
}

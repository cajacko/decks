import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckCardDefaults() {
  const params = useLocalSearchParams();

  const deckId = params[paramKeys.deckId];

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckCardDefaults.name}: deckId must be a string`);
  }

  const target = React.useMemo<Target>(
    () => ({
      id: deckId,
      type: "deck-defaults",
    }),
    [deckId],
  );

  return <EditCard target={target} />;
}

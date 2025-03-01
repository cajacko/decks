import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export const paramKeys = {
  cardId: "cardId",
  side: "side",
  deckId: "deckId",
};

export default function EditCardScreen() {
  const params = useLocalSearchParams();
  const { canGoBack, back, navigate } = useRouter();

  const cardId = params[paramKeys.cardId];
  const side = params[paramKeys.side];

  if (typeof cardId !== "string") {
    throw new AppError(`${EditCardScreen.name} cardId must be a string`);
  }

  const onDelete = React.useCallback(() => {
    if (canGoBack()) {
      back();

      return;
    }

    // Default to home if we can't go back
    navigate("/");
  }, [canGoBack, back, navigate]);

  const target = React.useMemo<Target>(
    () => ({
      id: cardId,
      type: "card",
    }),
    [cardId],
  );

  const initialSide = side === "back" || side === "front" ? side : null;

  return (
    <EditCard target={target} initialSide={initialSide} onDelete={onDelete} />
  );
}

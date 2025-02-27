import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export const paramKeys = {
  cardId: "cardId",
  side: "side",
};

export default function EditCardScene() {
  const params = useLocalSearchParams();

  const cardId = params[paramKeys.cardId];
  const side = params[paramKeys.side];

  if (typeof cardId !== "string") {
    throw new AppError(`${EditCardScene.name} cardId must be a string`);
  }

  const target = React.useMemo<Target>(
    () => ({
      id: cardId,
      type: "card",
    }),
    [cardId],
  );

  const initialSide = side === "back" || side === "front" ? side : null;

  return <EditCard target={target} initialSide={initialSide} />;
}

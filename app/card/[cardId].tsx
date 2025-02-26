import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export default function EditCardScene() {
  const { cardId } = useLocalSearchParams();

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

  return <EditCard target={target} />;
}

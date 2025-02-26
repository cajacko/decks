import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard, { EditCardProps } from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export default function DeckNewCardScene() {
  const { deckId } = useLocalSearchParams();

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckNewCardScene.name}: deckId must be a string`);
  }

  const initTarget = React.useMemo<Target>(
    () => ({
      id: deckId,
      type: "new-card-in-deck",
    }),
    [deckId],
  );

  const [target, setTarget] = React.useState<Target>(initTarget);

  const onChangeTarget = React.useCallback<
    NonNullable<EditCardProps["onChangeTarget"]>
  >(
    (target: Target | null) => {
      setTarget(target ?? initTarget);
    },
    [initTarget],
  );

  return <EditCard target={target} onChangeTarget={onChangeTarget} />;
}

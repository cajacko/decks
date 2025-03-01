import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import EditCard, { EditCardProps } from "@/components/EditCard";
import AppError from "@/classes/AppError";
import { Target } from "@/utils/cardTarget";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckNewCardScene() {
  const params = useLocalSearchParams();
  const { canGoBack, back, navigate } = useRouter();

  const deckId = params[paramKeys.deckId];

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckNewCardScene.name}: deckId must be a string`);
  }

  const onDelete = React.useCallback(() => {
    if (canGoBack()) {
      back();

      return;
    }

    // Default to home if we can't go back
    navigate("/");
  }, [canGoBack, back, navigate]);

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

  return (
    <EditCard
      target={target}
      onChangeTarget={onChangeTarget}
      onDelete={onDelete}
    />
  );
}

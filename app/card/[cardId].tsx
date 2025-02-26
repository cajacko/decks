import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";
import AppError from "@/classes/AppError";

export default function EditCardScene() {
  const { cardId } = useLocalSearchParams();

  if (typeof cardId !== "string") {
    throw new AppError(`${EditCardScene.name} cardId must be a string`);
  }

  return <EditCard id={cardId} type="card" />;
}

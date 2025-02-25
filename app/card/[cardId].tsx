import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCard from "@/components/EditCard";

export default function EditCardScene() {
  const { cardId } = useLocalSearchParams();

  if (typeof cardId !== "string") {
    throw new Error("cardId must be a string");
  }

  return <EditCard cardId={cardId} />;
}

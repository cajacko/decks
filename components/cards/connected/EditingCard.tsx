import React from "react";
import Card, { CardProps } from "./Card";
import { useEditCardSideState } from "@/context/EditCard";

export type EditingCardProps = Omit<CardProps, "values">;

export default function EditingCard(props: EditingCardProps): React.ReactNode {
  const values = useEditCardSideState(props.side, props.target);

  return <Card {...props} values={values} />;
}

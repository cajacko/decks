import React from "react";
import { useCardProps, CardProps } from "./Card";
import UICard, { CardProps as UICardProps } from "@/components/cards/ui/Card";
import { useEditCardSideState } from "@/context/EditCard";

export type EditingCardProps = Omit<CardProps, "values">;

export function useEditCardProps(props: EditingCardProps): UICardProps {
  const cardProps = useCardProps(props);
  const values = useEditCardSideState(props.side, props.target);

  return {
    ...cardProps,
    values: values ?? cardProps.values,
  };
}

export default function EditingCard(props: EditingCardProps): React.ReactNode {
  const editCardProps = useEditCardProps(props);

  return <UICard {...editCardProps} />;
}

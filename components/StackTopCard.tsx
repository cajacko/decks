import React from "react";
import CardInstance, { CardInstanceProps } from "./CardInstance";

export interface StackTopCardProps extends CardInstanceProps {}

export default function StackTopCard(
  props: StackTopCardProps
): React.ReactNode {
  return <CardInstance {...props} />;
}

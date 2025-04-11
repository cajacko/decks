import { CardInstanceProps } from "@/components/cards/connected/CardInstance";
import React from "react";
import { StackListRef } from "@/components/stacks/StackList";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  hideActions?: boolean;
  stackListRef: React.RefObject<StackListRef>;
}

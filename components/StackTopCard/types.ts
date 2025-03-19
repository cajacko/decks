import { CardInstanceProps } from "@/components/cards/connected/CardInstance";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

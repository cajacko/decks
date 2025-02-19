import { CardInstanceProps } from "@/components/CardInstance";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  cardInstanceId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

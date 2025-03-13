import { CardInstanceProps } from "@/components/CardInstance";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

import { CardInstanceProps } from "@/components/CardInstance";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  tabletopId: string;
  cardInstanceId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

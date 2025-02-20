import { CardInstanceProps } from "@/components/CardInstance";
import { MenuItem, RenderItemMenuItem } from "../HoldMenu";

export type StackTopCardMenuItem = MenuItem<{
  icon: string;
  onPress: () => void;
}>;

export type StackTopCardRenderItem = RenderItemMenuItem<StackTopCardMenuItem>;

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  cardInstanceId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

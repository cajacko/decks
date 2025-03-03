import { CardInstanceProps } from "@/components/CardInstance";
import { MenuItem, RenderItemMenuItem } from "../HoldMenu";
import { IconSymbolName } from "../IconSymbol";

export type StackTopCardMenuItem = MenuItem<{
  icon: IconSymbolName;
  onPress: () => void;
}>;

export type StackTopCardRenderItem = RenderItemMenuItem<StackTopCardMenuItem>;

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

import { StyleProp, ViewStyle } from "react-native";
import { StackListRef } from "@/components/StackList/StackList.types";

export interface StackProps {
  stackId: string;
  style?: StyleProp<ViewStyle>;
  leftStackId?: string;
  rightStackId?: string;
  stackListRef: React.RefObject<StackListRef>;
  canDelete?: boolean;
}

export type StackDimensions = {
  cardWidth: number;
  cardHeight: number;
  stackWidth: number;
  stackHeight: number;
  buttonSize: number;
  stackPadding: number;
  spaceBetweenStacks: number;
};

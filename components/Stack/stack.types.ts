import { StyleProp, ViewStyle } from "react-native";
import { StackListRef } from "@/components/StackList/StackList.types";
import { Scale } from "../cards/context/PhysicalMeasures";

export interface StackProps {
  stackId: string;
  style?: StyleProp<ViewStyle>;
  leftStackId?: string;
  rightStackId?: string;
  stackListRef: React.RefObject<StackListRef>;
  canDelete?: boolean;
  skeleton?: boolean;
  canShowEditDeck?: boolean;
}

export type StackDimensions = {
  stackWidth: number;
  stackHeight: number;
  buttonSize: number;
  stackHorizontalPadding: number;
  stackVerticalPadding: number;
  spaceBetweenStacks: number;
  cardHeight: number;
  cardWidth: number;
  scale: Scale;
};

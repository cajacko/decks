import { StyleProp, ViewStyle } from "react-native";
import { StackListRef } from "@/components/StackList/StackList.types";
import { CardSizeProps } from "@/components/Card/Card.types";

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
  stackPadding: number;
  spaceBetweenStacks: number;
  cardSizes: CardSizeProps;
};

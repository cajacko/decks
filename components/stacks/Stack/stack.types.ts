import { StyleProp, ViewStyle } from "react-native";
import { StackListRef } from "@/components/stacks/StackList/StackList.types";
import { Scale } from "../../cards/context/PhysicalMeasures";

export interface StackProps {
  stackId: string;
  style?: StyleProp<ViewStyle>;
  leftStackId?: string;
  rightStackId?: string;
  stackListRef: React.RefObject<StackListRef>;
  canDelete?: boolean;
  canShowEditDeck?: boolean;
  /**
   * When this stack is a clear target/ focus for the user. If it's the only one in view then it is
   * focussed. But if multiple are then we may not have any focus.
   */
  isFocussed: boolean | null;
}

export type StackDimensions = {
  stackWidth: number;
  stackHeight: number;
  buttonSize: number;
  stackHorizontalPadding: number;
  stackVerticalPadding: number;
  spaceBetweenStacks: number;
  scale: Scale;
  canOnlyFit1Stack: boolean;
};

import { StyleProp, ViewStyle } from "react-native";

export interface StackProps {
  stackId: string;
  style?: StyleProp<ViewStyle>;
  leftStackId?: string;
  rightStackId?: string;
}

export type PositionStyle = StyleProp<ViewStyle> | undefined;

export type StackDimensions = {
  cardWidth: number;
  cardHeight: number;
  stackWidth: number;
  stackHeight: number;
  buttonSize: number;
  positionStyles: PositionStyle[];
  stackPadding: number;
  spaceBetweenStacks: number;
};

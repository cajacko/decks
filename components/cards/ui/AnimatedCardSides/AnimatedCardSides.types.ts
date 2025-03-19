import { Cards } from "@/store/types";
import { ViewStyle, StyleProp } from "react-native";
import {
  AnimatedCardRef,
  AnimatedCardProps,
} from "@/components/cards/ui/AnimatedCard";

export interface AnimatedCardSidesRef
  extends Pick<AnimatedCardRef, "animateOut" | "getIsAnimating"> {
  animateFlip: () => Promise<Cards.Side>;
}

export interface AnimatedCardSidesProps {
  style?: StyleProp<ViewStyle>;
  side: Cards.Side;
  front: AnimatedCardProps;
  back: AnimatedCardProps;
}

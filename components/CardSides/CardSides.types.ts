import { CardProps } from "@/components/Card";
import { CardSideProps } from "@/components/CardSide";
import { CardRef } from "@/components/Card";
import { Cards } from "@/store/types";
import { ViewStyle } from "react-native";

export interface CardSidesRef
  extends Pick<CardRef, "animateOut" | "getIsAnimating"> {
  animateFlip: () => Promise<unknown>;
}

export interface CardSidesProps extends CardSideProps {
  side: Cards.Side;
  style?: ViewStyle;
  CardProps?: CardProps;
}

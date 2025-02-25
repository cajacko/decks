import { CardProps } from "@/components/Card";
import { CardRef } from "@/components/Card";

export interface CardInstanceRef
  extends Pick<CardRef, "animateOut" | "getIsAnimating"> {
  animateFlip: () => Promise<unknown>;
}

export interface CardInstanceProps {
  cardInstanceId: string;
  CardProps?: CardProps;
}

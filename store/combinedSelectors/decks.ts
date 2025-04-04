import { RootState } from "../types";
import { Target } from "@/utils/cardTarget";
import { selectDeckByCard } from "./cards";

export const selectDeckId = (state: RootState, props: Target) =>
  props.type === "card"
    ? selectDeckByCard(state, { cardId: props.id })?.id
    : props.id;

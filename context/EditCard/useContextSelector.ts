import { withUseContextSelector } from "@/context/useContextSelector";
import { EditCardContext } from "./EditCard.types";

const { context, useContextSelector, useRequiredContextSelector } =
  withUseContextSelector<EditCardContext | null>(null);

export { context, useContextSelector, useRequiredContextSelector };

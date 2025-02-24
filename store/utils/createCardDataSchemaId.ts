import { Cards, Templates, Decks } from "../types";

export type CreateCardDataSchemaProps = {
  side: Cards.Side;
  templateDataItemId: Templates.DataItemId;
};

export default function createCardDataSchemaId(
  props: CreateCardDataSchemaProps,
): Decks.DataSchemaItemId {
  return `${props.side}:${props.templateDataItemId}`;
}

import { Cards, Templates, Decks } from "../types";

export type CreateCardDataSchemaProps = {
  side: Cards.Side;
  templateDataItemId: Templates.DataId;
};

export default function createCardDataSchemaId(
  props: CreateCardDataSchemaProps,
): Decks.DataId {
  // NOTE: Don't combine the side, let the user remap the data if they want to. Most of the time,
  // this is what we'd want
  return props.templateDataItemId;
}

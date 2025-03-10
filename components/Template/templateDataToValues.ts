import { Templates } from "@/store/types";
import { Values, DeckValues } from "./Template.types";
import { LooseCardTemplateData } from "@/store/combinedSelectors/cards";

export { Values };

export type DataValueMap = Record<string, Templates.ValidatedValue | undefined>;

export default function templateDataToValues(
  data: LooseCardTemplateData | DataValueMap,
  deckData: DeckValues,
): Values {
  const values: Values = {
    deck: deckData,
  };

  for (const key in data) {
    const prop = data[key];

    if (prop) {
      values[key] = "value" in prop ? prop.value : prop.validatedValue?.value;
    }
  }

  return values;
}

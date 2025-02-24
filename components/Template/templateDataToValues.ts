import { Templates } from "@/store/types";
import { Values, Data } from "./Template.types";

export { Values };

export type DataValueMap = Record<string, Templates.DataValue | undefined>;

export default function templateDataToValues(
  data: Data | DataValueMap,
): Values {
  const values: Values = {};

  for (const key in data) {
    const prop = data[key];

    if (prop) {
      values[key] =
        typeof prop.value === "object" ? prop.value.value : prop.value;
    }
  }

  return values;
}

import { Templates } from "../types";
import { CreateCardDataSchemaProps } from "../utils/createCardDataSchemaId";

export type CardDataItem =
  | {
      cardDataId: string;
      value: Templates.ValidatedValue | null;
    }
  | (CreateCardDataSchemaProps & {
      value: Templates.ValidatedValue | null;
    });
